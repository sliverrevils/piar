// src/lib/auth.ts
import { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import YandexProvider from "next-auth/providers/yandex";
import VkProvider from "next-auth/providers/vk";
import MailRuProvider from "next-auth/providers/mailru";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/MongoDb/connect/mongodb";
import { UserModel } from "@/MongoDb/models/userModel";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID!,
            clientSecret: process.env.YANDEX_CLIENT_SECRET!,
        }),
        VkProvider({
            clientId: process.env.VK_CLIENT_ID!,
            clientSecret: process.env.VK_CLIENT_SECRET!,
        }),
        MailRuProvider({
            clientId: process.env.MAIL_CLIENT_ID!,
            clientSecret: process.env.MAIL_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Пароль", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                const { email, password } = credentials as { email: string; password: string };
                const user = await UserModel.findOne({ email });
                console.log("USER", user);

                if (!user) {
                    throw new Error("Пользователь не найден");
                }

                const isValidPassword = await bcrypt.compare(password, user.password || "");
                if (!isValidPassword) {
                    throw new Error("Неверный пароль");
                }

                return { id: user._id.toString(), name: user.name, email: user.email };
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account, profile }) {
            await connectDB();

            if (profile && account && account.provider !== "credentials") {
                const existingUser = await UserModel.findOne({ email: profile.email });

                if (!existingUser) {
                    await UserModel.create({
                        name: profile.name || profile.email!.split("@")[0],
                        email: profile.email,
                        image: profile.image || null,
                        provider: account.provider,
                    });
                }
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (token && session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET!,
};

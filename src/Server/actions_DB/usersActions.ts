"use server";

import { connectDB } from "@/MongoDb/connect/mongodb";
import { IUser, UserModel } from "@/MongoDb/models/userModel";

export async function findUserByEmail({ email }: { email: string }): Promise<IUser | null> {
    await connectDB();
    return await UserModel.findOne({ email });
}

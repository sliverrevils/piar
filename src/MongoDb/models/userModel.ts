import mongoose, { Model, Schema, model, models } from "mongoose";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    provider: string;
    image?: string;
}

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        provider: { type: String },
        image: { type: String },
    },
    { timestamps: true }
);

//export const UserModel = models.User || model("User", userSchema);

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

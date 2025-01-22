import mongoose, { Model, Schema, model, models } from "mongoose";

interface IUser {
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

// const User = models.User || model("User", UserSchema);
// export default User;

export const UserModel: Model<IUser> = mongoose.models.Settings || mongoose.model<IUser>("User", userSchema);

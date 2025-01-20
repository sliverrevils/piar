import mongoose, { Model, Schema } from "mongoose";

export interface ISettings {
    shopName: string;
    categories: { name: string; subcategories: string[] }[];
    transformationMechanisms: string[];
    carcasses: string[];
}

const settingsSchema = new Schema<ISettings>({
    shopName: String,
    categories: [{ name: String, subcategories: [String] }],
    transformationMechanisms: { type: [String] },
    carcasses: { type: [String] },
});

export const SettingsModel: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>("Settings", settingsSchema);

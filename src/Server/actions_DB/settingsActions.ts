"use server";

import { connectDB } from "@/MongoDb/connect/mongodb";
import { ISettings, SettingsModel } from "@/MongoDb/models/settingsModel";
import { sofaFrameMaterials, sofaMechanisms } from "../../../settings/settingsInitVars";
import { fixDBRes } from "../../../utils/mongoUtils";

const defaultSettings: ISettings = {
    shopName: "Shop name",
    carcasses: sofaFrameMaterials,
    categories: [],
    transformationMechanisms: sofaMechanisms,
};

export async function getOrInitSettings(): Promise<ISettings | null> {
    try {
        await connectDB();
        const settings = (await SettingsModel.findOne()) || (await SettingsModel.create(defaultSettings));
        return fixDBRes(settings);
    } catch (error) {
        console.log("‼️ SETTINGS ERROR ⚠️", error);
        return null;
    }
}

export async function updateSettings({ settingsNew }: { settingsNew: ISettings }): Promise<boolean> {
    try {
        connectDB();
        const settings = (await SettingsModel.findOne()) || (await SettingsModel.create(defaultSettings));

        for (const key in settingsNew) {
            settings[key] = settingsNew[key];
        }

        await settings.save();
        return true;
    } catch (error) {
        console.log("‼️ ERROR SAVE SETTINGS", error);
        return false;
    }
}

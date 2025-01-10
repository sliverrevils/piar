"use server";

import { connectDB } from "@/MongoDb/connect/mongodb";
import { IItem, IItemForCreate, ItemModel } from "@/MongoDb/models/itemModel";
import { RemoveMetaFields } from "../../../types/typesFunc";

export default async function createItemAction({ item }: { item: IItem }): Promise<boolean> {
    try {
        await connectDB();
        let newItem = new ItemModel(item);

        console.log("ser item", newItem);
        await newItem.save();
        return true;
    } catch (error) {
        console.log("❌Item error❌", error);
        return false;
    }
}

import mongoose, { Model, Schema } from "mongoose";
import { RemoveMetaFields } from "../../../types/typesFunc";

export interface IItem {
    _id?: string;
    created_at?: string;
    updated_at?: string;

    name: string; //Название
    katigory: string; //Катигория (вводим строку либо на выбор из тех что есть)
    price: number; //Цена
    count: number; //Наличие (в наличии / под заказ)
    dimensions: {
        //Габариты
        length: number; //Длина (L) – измеряется по самой длинной стороне дивана, обычно от одного подлокотника до другого.
        width: number; //Ширина или Глубина (W/D) – измеряется от передней части сиденья до задней спинки.
        height: number; //Высота (H) – измеряется от пола до верхней точки спинки или подушек.
    };
    bedSize: {
        //Размер спального места
        length: number;
        width: number;
    };
    transformationMechanism: string; //Механизм трансформации
    content: string[]; //Наполнение
    carcass: string[]; //Каркас
    laundryDrawer: boolean; //Ящик для белья
    removableCover: boolean; //Съемный чехол
    warranty: number; //Гарантия
    descriptions: string; //Описание
}

export type IItemForCreate = RemoveMetaFields<IItem>;

const itemSchema = new Schema<IItem>(
    {
        name: { type: String, required: true },
        katigory: { type: String, required: true },
        price: { type: Number, required: true },
        count: { type: Number, required: true },
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
        bedSize: {
            length: Number,
            width: Number,
        },
        transformationMechanism: { type: String, required: true },
        content: { type: [String], required: true },
        carcass: { type: [String], required: true },
        laundryDrawer: { type: Boolean, required: true },
        removableCover: { type: Boolean, required: true },
        warranty: { type: Number, required: true },
        descriptions: { type: String, required: true },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

//export const ItemModel: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>("ItemModel", new mongoose.Schema({ _id: { type: String, required: true } }, { strict: false }));
export const ItemModel: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>("Item", itemSchema);

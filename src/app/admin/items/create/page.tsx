"use client";
import { IItem, IItemForCreate } from "@/MongoDb/models/itemModel";
import { useState } from "react";
import styles from "./createItem.module.scss";
import createItemAction from "@/Server/actions_DB/itemsActions";

const initialItem: IItem = {
    name: "",
    katigory: "",
    price: 0,
    count: 0,
    dimensions: {
        length: 0,
        width: 0,
        height: 0,
    },
    bedSize: {
        length: 0,
        width: 0,
    },
    transformationMechanism: "",
    content: [],
    carcass: [],
    laundryDrawer: false,
    removableCover: false,
    warranty: 0,
    descriptions: "",
};

export default function CreateItem() {
    const [item, setItem] = useState<IItem>(initialItem);

    const onCreate = async () => {
        console.log("ITEM", item);

        if (await createItemAction({ item })) {
            alert("Created ✅");
            setItem(() => initialItem);
        } else {
            alert("Not created ❌");
        }
    };

    return (
        <div className={styles.createItemWrap}>
            <h1>Создание товара </h1>

            <h4>Название</h4>
            <input type="text" value={item.name} onChange={(e) => setItem((state) => ({ ...state, name: e.target.value }))} placeholder="назвние" />
            <h4>Категория</h4>
            <input type="text" value={item.katigory} onChange={(e) => setItem((state) => ({ ...state, katigory: e.target.value }))} placeholder="категория" />
            <h4>Цена</h4>
            <input type="text" value={item.price} onChange={(e) => setItem((state) => ({ ...state, price: Number(e.target.value) || 0 }))} placeholder="цена" />
            <h4>Количество</h4>
            <input type="text" value={item.count} onChange={(e) => setItem((state) => ({ ...state, count: Number(e.target.value) || 0 }))} placeholder="количество" />
            <h4>Габариты</h4>
            <div>
                <div>Длина</div>
                <input type="text" value={item.dimensions.length} onChange={(e) => setItem((state) => ({ ...state, dimensions: { ...state.dimensions, length: Number(e.target.value) || 0 } }))} placeholder="длина" />
                <div>Ширина</div>
                <input type="text" value={item.dimensions.width} onChange={(e) => setItem((state) => ({ ...state, dimensions: { ...state.dimensions, width: Number(e.target.value) || 0 } }))} placeholder="ширина" />
                <div>высота</div>
                <input type="text" value={item.dimensions.height} onChange={(e) => setItem((state) => ({ ...state, dimensions: { ...state.dimensions, height: Number(e.target.value) || 0 } }))} placeholder="высота" />
            </div>

            <h4>Размер спального места</h4>
            <div>
                <div>Длина</div>
                <input type="text" value={item.bedSize.length} onChange={(e) => setItem((state) => ({ ...state, bedSize: { ...state.bedSize, length: Number(e.target.value) || 0 } }))} placeholder="длина" />
                <div>Ширина</div>
                <input type="text" value={item.bedSize.width} onChange={(e) => setItem((state) => ({ ...state, bedSize: { ...state.bedSize, width: Number(e.target.value) || 0 } }))} placeholder="ширина" />
            </div>

            <h4>Механизм трансформации</h4>
            <input type="text" value={item.transformationMechanism} onChange={(e) => setItem((state) => ({ ...state, transformationMechanism: e.target.value }))} placeholder="Механизм трансформации" />
            {/* <h4>Наполнение</h4>
            <input type="text" value={item.content} onChange={(e) => setItem((state) => ({ ...state, content: e.target.value }))} placeholder="Наполнение" />
            <h4>Каркас</h4>
            <input type="text" value={item.carcass} onChange={(e) => setItem((state) => ({ ...state, carcass: e.target.value }))} placeholder="Каркас" /> */}

            <h4>Ящик для белья </h4>
            <label>
                <span>Нет</span>
                <input type="radio" value={"false"} checked={!item.laundryDrawer} onChange={(event) => setItem((state) => ({ ...state, laundryDrawer: event.target.value === "true" }))} />
            </label>
            <label>
                <span>Да</span>
                <input type="radio" value={"true"} checked={item.laundryDrawer} onChange={(event) => setItem((state) => ({ ...state, laundryDrawer: event.target.value === "true" }))} />
            </label>

            <h4>Съемный чехол</h4>
            <label>
                <span>Нет</span>
                <input type="radio" value={"false"} checked={!item.removableCover} onChange={(event) => setItem((state) => ({ ...state, removableCover: event.target.value === "true" }))} />
            </label>
            <label>
                <span>Да</span>
                <input type="radio" value={"true"} checked={item.removableCover} onChange={(event) => setItem((state) => ({ ...state, removableCover: event.target.value === "true" }))} />
            </label>

            <h4>Гарантия </h4>
            <input type="text" value={item.warranty} onChange={(e) => setItem((state) => ({ ...state, warranty: Number(e.target.value) || 0 }))} placeholder="цена" />

            <textarea value={item.descriptions} onChange={(e) => setItem((state) => ({ ...state, descriptions: e.target.value }))} placeholder="описание" />

            <button onClick={onCreate}>Create</button>
        </div>
    );
}

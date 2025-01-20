"use client";
import { ISettings } from "@/MongoDb/models/settingsModel";
import { updateSettings } from "@/Server/actions_DB/settingsActions";
import { CancelPresentationSharp, Clear, CloseFullscreenSharp, DeleteForeverOutlined, LibraryAdd, NoteAdd } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import styles from "./sett.module.scss";

export default function SettingsScreen({ settings }: { settings: ISettings }) {
    const [shopName, setShopName] = useState<string>(settings.shopName);
    const [categories, setCategories] = useState(settings.categories);
    const [transformationMechanisms, setTransformationMechanisms] = useState(settings.transformationMechanisms);
    const [carcasses, setCarcasses] = useState(settings.carcasses);

    const [isAddCategoty, setIsAddCategory] = useState(false);
    const [isAddMech, setIsAddMech] = useState(false);
    const [isAddCar, setIsAddCar] = useState(false);
    const [isAddSubCategoty, setIsAddSubCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newMechName, setNewMechName] = useState("");
    const [newCarName, setNewCarName] = useState("");

    //for saving status
    const [savedSettingsStr, setSavedSettingsStr] = useState(
        JSON.stringify({
            shopName: settings.shopName,
            carcasses: settings.carcasses,
            categories: settings.categories,
            transformationMechanisms: settings.transformationMechanisms,
        })
    );

    const isChange = useMemo(() => {
        console.log("MEMO", savedSettingsStr);
        return (
            JSON.stringify({
                shopName,
                carcasses,
                categories,
                transformationMechanisms, //
            }) !== savedSettingsStr
        );
    }, [shopName, carcasses, categories, transformationMechanisms, savedSettingsStr]);

    const onSaveChanges = async () => {
        const newSett = {
            shopName,
            carcasses,
            categories,
            transformationMechanisms,
        };
        const res = await updateSettings({
            settingsNew: newSett,
        });

        if (res) {
            toast.success("Настройки успешно обновлены");
            setSavedSettingsStr(JSON.stringify(newSett));
        } else {
            toast.warning("Ошибка сохранения");
        }
    };

    const onAddCategory = () => {
        if (!categories.find((cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
            setCategories((state) => [...state, { name: newCategoryName.toLowerCase(), subcategories: [] }]);
            setIsAddCategory(false);
        } else {
            toast.error(`Категория " ${newCategoryName} " уже существует ! `);
        }
    };

    const onDelCategory = (name: string) => {
        confirm(`Удалить категорию "${name}" со всеми подкатегориями ? , `) && setCategories((state) => state.filter((cat) => cat.name !== name));
    };

    const onAddSubcategory = (catName: string, newSabName: string) => {
        setCategories((state) => {
            const prevCopy = JSON.parse(JSON.stringify(state)) as typeof state;
            const curCat = prevCopy.find((cat) => cat.name === catName);
            if (!curCat || curCat.subcategories.includes(newSabName)) {
                toast.error(`Подкатегория "${newSabName}" уже существует в категории "${catName}"`);
                return state;
            }
            curCat.subcategories = [...curCat.subcategories, newSabName];
            return prevCopy;
        });
    };

    const onDelSubcategory = (catName: string, delSabName: string) => {
        confirm(`Удалить подкатегорию "${delSabName}" из категории "${catName}" ?`) && setCategories((state) => state.map((cat) => (cat.name !== catName ? cat : { ...cat, subcategories: cat.subcategories.filter((sub) => sub !== delSabName) })));
    };

    const onAddNewMech = () => {
        if (transformationMechanisms.includes(newMechName)) {
            toast.error(`Механизм транисвормации "${newMechName}" уже существует!`);
            return;
        }
        setTransformationMechanisms((state) => [...state, newMechName]);
        setIsAddMech(false);
    };

    const onDelMech = (name: string) => {
        setTransformationMechanisms((state) => state.filter((mech) => mech !== name));
    };

    const onAddNewCar = () => {
        if (carcasses.includes(newCarName)) {
            toast.error(`Механизм транисвормации "${newCarName}" уже существует!`);
            return;
        }
        setCarcasses((state) => [...state, newCarName]);
        setIsAddCar(false);
    };

    const onDelCar = (name: string) => {
        setCarcasses((state) => state.filter((car) => car !== name));
    };

    return (
        <div className={styles.settingsWrap}>
            <div className={styles.settingsItem}>
                <div className={styles.shopNameBlock}>
                    <h3>Название магазина</h3>
                    <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                </div>
            </div>

            <div className={styles.settingsItem}>
                <h3>Категории</h3>
                <div className={styles.categotiesList}>
                    {categories.map((categorie) => {
                        const addSubCatFunc = onAddSubcategory.bind(null, categorie.name);
                        return (
                            <div key={categorie.name + "_catNameKey"} className={styles.cateroryItem}>
                                <div className={styles.nameBlock}>
                                    <div>{categorie.name}</div>
                                    <DeleteForeverOutlined sx={{ fontSize: 30 }} onClick={() => onDelCategory(categorie.name)} />
                                </div>
                                <div className={styles.subCatBlock}>
                                    <h4>{categorie.subcategories.length ? "подкатегории:" : "нет подкатегорий"}</h4>
                                    <div className={styles.subCatList}>
                                        {categorie.subcategories.map((subCat) => (
                                            <div key={categorie.name + subCat + "_subCatKey"} className={styles.subCatItem}>
                                                <div> {subCat}</div>
                                                <Clear sx={{ fontSize: 30 }} onClick={() => onDelSubcategory(categorie.name, subCat)} />
                                            </div>
                                        ))}
                                    </div>

                                    <SubCategoryAdd subCats={categorie.subcategories} addSubCatFunc={addSubCatFunc} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {isAddCategoty ? (
                    <div>
                        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value.toLowerCase())} />

                        <LibraryAdd sx={{ fontSize: 30 }} onClick={onAddCategory} />

                        <CancelPresentationSharp sx={{ fontSize: 30 }} onClick={() => setIsAddCategory(false)} />
                    </div>
                ) : (
                    <div
                        className={styles.addCategoryBtn}
                        onClick={() => {
                            setIsAddCategory(true), setNewCategoryName("");
                        }}
                    >
                        <LibraryAdd sx={{ fontSize: 30 }} />
                        <span>Добавить категорию</span>
                    </div>
                )}
            </div>

            <div className={styles.settingsItem}>
                <h3>Механизмы</h3>

                <div className={styles.mechList}>
                    {transformationMechanisms.map((mech) => (
                        <div key={mech + "_mechKey"} className={styles.mechItem}>
                            <span>{mech}</span>
                            <Clear sx={{ fontSize: 30 }} onClick={() => onDelMech(mech)} />
                        </div>
                    ))}
                </div>

                {isAddMech ? (
                    <div>
                        <input value={newMechName} onChange={(e) => setNewMechName(e.target.value.toLowerCase())} />
                        {newMechName.length > 2 && <NoteAdd sx={{ fontSize: 30 }} onClick={onAddNewMech} />}
                        <CancelPresentationSharp sx={{ fontSize: 30 }} onClick={() => setIsAddMech(false)} />
                    </div>
                ) : (
                    <div
                        onClick={() => {
                            setIsAddMech(true);
                            setNewMechName("");
                        }}
                    >
                        <span>Добавить механизм</span>
                        <NoteAdd />
                    </div>
                )}
            </div>

            <div className={styles.settingsItem}>
                <h3>Каркасы</h3>

                <div className={styles.carcassesList}>
                    {carcasses.map((car) => (
                        <div key={car + "_carKey"} className={styles.carcassItem}>
                            <span>{car}</span>
                            <Clear sx={{ fontSize: 30 }} onClick={() => onDelCar(car)} />
                        </div>
                    ))}
                </div>

                {isAddCar ? (
                    <div>
                        <input value={newCarName} onChange={(e) => setNewCarName(e.target.value.toLowerCase())} />
                        {newCarName.length > 2 && <NoteAdd sx={{ fontSize: 30 }} onClick={onAddNewCar} />}
                        <CancelPresentationSharp sx={{ fontSize: 30 }} onClick={() => setIsAddCar(false)} />
                    </div>
                ) : (
                    <div
                        onClick={() => {
                            setIsAddCar(true);
                            setNewCarName("");
                        }}
                    >
                        <span>Добавить каркас</span>
                        <NoteAdd />
                    </div>
                )}
            </div>

            {isChange && (
                <div onClick={onSaveChanges} className={styles.saveSettingsBtn}>
                    Сохранить изменения
                </div>
            )}
        </div>
    );
}

//------

const SubCategoryAdd = ({ subCats, addSubCatFunc }: { subCats: string[]; addSubCatFunc: Function }) => {
    const [isAddSub, setIsAddSub] = useState(false);
    const [input, setInput] = useState("");
    return isAddSub ? (
        <div>
            <input value={input} onChange={(e) => setInput(e.target.value.toLowerCase())} />
            {input.length > 2 && !subCats.includes(input) && (
                <NoteAdd
                    sx={{ fontSize: 30 }}
                    onClick={() => {
                        addSubCatFunc(input.toLowerCase());
                        setIsAddSub(false);
                    }}
                />
            )}
            <CancelPresentationSharp sx={{ fontSize: 30 }} onClick={() => setIsAddSub(false)} />
        </div>
    ) : (
        <div
            className={styles.addSubCatBtn}
            onClick={() => {
                setIsAddSub(true);
                setInput("");
            }}
        >
            <span>Добавить подкатегорию</span>
            <NoteAdd sx={{ fontSize: 30 }} />
        </div>
    );
};

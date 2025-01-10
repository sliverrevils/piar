import BabylonModelWithAnimation from "@/app/components/view/BabylonModelViewer/BabylonModelViewer";
import { IItem } from "@/MongoDb/models/itemModel";
import styles from "./item.module.scss";

const mockSofa: IItem = {
    name: "Таурус с оттоманкой",
    katigory: "Corner sofa",
    price: 189100,
    count: 1,
    dimensions: {
        length: 353,
        width: 200,
        height: 98,
    },
    bedSize: {
        length: 168,
        width: 202,
    },
    transformationMechanism: "МТД-12",
    content: ["HS3530", "пружина змейка"],
    carcass: ["фанера", "сосна", "ламинированное ДСП"],
    laundryDrawer: true,
    removableCover: false,
    warranty: 12,
    descriptions: `Угловой диван "Таурус" с оттоманкой — стиль, комфорт и функциональность в одном решении\n

Размеры: 353 x 200 x 98 см\n

"Таурус" — это сочетание элегантного дизайна и продуманной функциональности, созданное для вашего максимального комфорта. Просторный угловой диван идеально впишется в современный интерьер и станет уютным центром вашей гостиной.\n

Уникальные особенности:\n
Выдвижной стол с подъемным механизмом — стильная и практичная тумба для хранения мелочей и организации пространства.\n
Открывающаяся оттоманка — вместительное пространство для хранения постельного белья, подушек и других вещей.\n
Комплект подушек — мягкость и уют в каждом прикосновении.\n
Материалы и наполнение:\n
Наполнитель: HS3530 и пружинный блок типа "змейка" — оптимальная поддержка и долговечность.\n
Каркас: фанера, массив сосны и ламинированное ДСП — прочность и надежность конструкции.\n
Выбор обивки и цвета:\n
Вы можете увидеть диван "Таурус" в 3D прямо на нашем сайте! Оцените его со всех сторон, выберите подходящую обивку и цвет, чтобы он идеально соответствовал вашему интерьеру.\n

"Таурус" — не просто диван, а универсальное решение для отдыха, хранения и создания уюта в вашем доме!\n`,
};

export default async function ItemPage(props) {
    const { id } = await props.params;
    console.log("Props", await props.searchParams);
    return (
        <article className={styles.itemPageWrap}>
            <h1>Таурус</h1>

            <div className={styles.modelBlock}>
                <BabylonModelWithAnimation modelPath="\items\Taurus\model\taurus_otom_anim.glb" />
            </div>
            <div className={styles.descriptionsBlock}>{mockSofa.descriptions}</div>
        </article>
    );
}

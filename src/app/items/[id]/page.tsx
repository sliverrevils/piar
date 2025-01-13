import BabylonModelWithAnimation from "@/app/components/view/BabylonModelViewer/BabylonModelViewer";
import { IItem } from "@/MongoDb/models/itemModel";
import styles from "./item.module.scss";
import SliderWithThumbnails from "@/app/components/common/Slider/Slider";
import Image from "next/image";
import Tabs from "@/app/components/common/Tabs/Tabs";
//import Slider from "@/app/components/common/Slider/Slider";
import { Caveat } from "next/font/google";
import { caveatFont, tekturFont } from "@/app/fonts";

const mockSofa: IItem = {
    name: "Таурус с оттоманкой",
    katigory: "Corner sofa",
    price: 189100,
    count: 1,
    dimensions: {
        length: 200, //глубина
        width: 353, //ширина
        height: 98, //высота
    },
    bedSize: {
        length: 202,
        width: 168,
    },
    transformationMechanism: "МТД-12",
    content: ["HS3530", "пружина змейка"],
    carcass: ["фанера", "сосна", "ламинированное ДСП"],
    laundryDrawer: true,
    removableCover: false,
    warranty: 12,
    descriptions: `Угловой диван "Таурус" с оттоманкой — стиль, комфорт и функциональность в одном решении


"Таурус" — это сочетание элегантного дизайна и продуманной функциональности, созданное для вашего максимального комфорта. Просторный угловой диван идеально впишется в современный интерьер и станет уютным центром вашей гостиной.

Уникальные особенности:
Выдвижной стол с подъемным механизмом — стильная и практичная тумба для хранения мелочей и организации пространства.
Открывающаяся оттоманка — вместительное пространство для хранения постельного белья, подушек и других вещей.
Комплект подушек — мягкость и уют в каждом прикосновении.
Материалы и наполнение:
Наполнитель: HS3530 и пружинный блок типа "змейка" — оптимальная поддержка и долговечность.
Каркас: фанера, массив сосны и ламинированное ДСП — прочность и надежность конструкции.
Выбор обивки и цвета:
Вы можете увидеть диван "Таурус" в 3D прямо на нашем сайте! Оцените его со всех сторон, выберите подходящую обивку и цвет, чтобы он идеально соответствовал вашему интерьеру.

"Таурус" — не просто диван, а универсальное решение для отдыха, хранения и создания уюта в вашем доме!`,
};

export default async function ItemPage(props) {
    const { id } = await props.params;
    console.log("Props", await props.searchParams);

    const sliderBlockHtml = (
        <div className={styles.sliderBlock}>
            <SliderWithThumbnails>
                {/* <BabylonModelWithAnimation modelPath="\items\Taurus\model\taurus_otom_anim.glb" /> */}
                <Image src={"/items/Taurus/img/photo_2023-09-01_12-30-16.jpg"} alt="img" width={3000} height={2000} />
                <Image src={"/items/Taurus/img/photo_2023-09-01_12-30-59.jpg"} alt="img" width={3000} height={2000} />
                <Image src={"/items/Taurus/img/photo_2023-09-01_12-31-04.jpg"} alt="img" width={3000} height={2000} />
                <Image src={"/items/Taurus/img/photo_2023-09-01_12-31-08.jpg"} alt="img" width={3000} height={2000} />
                <Image src={"/items/Taurus/img/photo_2023-09-01_12-31-15.jpg"} alt="img" width={3000} height={2000} />
                <Image src={"/items/Taurus/img/taurus1.jpg"} alt="img" width={3000} height={2000} />
            </SliderWithThumbnails>
        </div>
    );

    const modelBlockHtml = (
        <div className={styles.modelBlock}>
            <BabylonModelWithAnimation modelPath="\items\Taurus\model\taurus_otom_anim.glb" base1Material="fabric5" base2Material="wood" base3Material="wood3" />
        </div>
    );

    const viewBlockHtml = (
        <div className={styles.viewBlock}>
            <Tabs>
                {[
                    {
                        name: "3D",
                        node: modelBlockHtml,
                        about: "Вы просматриваете 3D модель дивана. Вы можете вращать её, чтобы рассмотреть со всех сторон, а также кликать на активные части, чтобы разложить их. В полноэкранном режиме доступны дополнительные настройки: изменение цвета и материала обивки, выбор материала каркаса, а также настройка материала внутренних ящиков.Используйте мышь для управления моделью и наслаждайтесь её гибкими возможностями!",
                    },
                    {
                        name: "Фотографии",
                        node: sliderBlockHtml,
                        about: "photos",
                    },
                ]}
            </Tabs>
        </div>
    );

    const descriptionsBlockHtml = (
        <div className={styles.descriptionsBlock} style={{ ...tekturFont.style, fontSize: 17 }}>
            <div className={styles.paramsList}>
                <table>
                    <tbody>
                        <tr>
                            <td>Категория:</td>
                            <td>угловые диваны</td>
                        </tr>
                        <tr>
                            <td>Габариты:</td>
                            <td>
                                <div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Ширина</td>
                                                <td>{mockSofa.dimensions.width}</td>
                                            </tr>
                                            <tr>
                                                <td>Высота</td>
                                                <td>{mockSofa.dimensions.height}</td>
                                            </tr>
                                            <tr>
                                                <td>Глубина</td>
                                                <td>{mockSofa.dimensions.length}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Спальное место:</td>
                            <td>
                                <div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Ширина</td>
                                                <td>{mockSofa.bedSize.width}</td>
                                            </tr>
                                            <tr>
                                                <td>Высота</td>
                                                <td>{mockSofa.bedSize.length}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Механизм трансформации:</td>
                            <td>{mockSofa.transformationMechanism}</td>
                        </tr>
                        <tr>
                            <td>Наполнение:</td>
                            <td>{mockSofa.content.join(", ")}</td>
                        </tr>
                        <tr>
                            <td>Каркас:</td>
                            <td>{mockSofa.carcass.join(", ")}</td>
                        </tr>
                        <tr>
                            <td>Ящик для белья:</td>
                            <td>{mockSofa.laundryDrawer ? "есть" : "нет"}</td>
                        </tr>
                        <tr>
                            <td>Съемный чехол:</td>
                            <td>{mockSofa.removableCover ? "есть" : "нет"}</td>
                        </tr>
                        <tr>
                            <td>Гарантия:</td>
                            <td>{mockSofa.warranty} мес.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Image src={"/items/Taurus/schema/taurusShema.png"} width={500} height={180} alt="schema" className={styles.imgSchema} />
        </div>
    );

    return (
        <article className={styles.itemPageWrap}>
            <div className={styles.itemNameBlock}>
                <h1>Таурус</h1>
                <div className={styles.itemParamsBlock}>
                    <div className={styles.paramItem}>угловой диван</div>
                    <div className={styles.paramItem}>с отоманкой</div>
                </div>
            </div>
            <h2 className={styles.itemInfoTextLine} style={{ ...caveatFont.style, textAlign: "center" }}>
                <b>"Таурус"</b> — это сочетание элегантного дизайна и продуманной функциональности, созданное для вашего максимального комфорта.
            </h2>
            <div className={styles.itemBlock}>
                {viewBlockHtml}

                {descriptionsBlockHtml}
            </div>
            <div className={styles.aboutBlock} style={{ ...caveatFont.style }}>
                <h2 className={styles.maintText}>Просторный угловой диван идеально впишется в современный интерьер и станет уютным центром вашей гостиной.</h2>
                <div className={styles.speshalBlock} style={{ ...tekturFont.style }}>
                    <h3>Уникальные особенности:</h3>
                    <ul>
                        <li>
                            <b>Выдвижной стол с подъемным механизмом</b> — стильная и практичная тумба для хранения мелочей и организации пространства.
                        </li>
                        <li>
                            <b>Открывающаяся оттоманка</b> — вместительное пространство для хранения постельного белья, подушек и других вещей.
                        </li>
                        <li>
                            <b>Комплект подушек</b> — мягкость и уют в каждом прикосновении.
                        </li>
                    </ul>
                </div>
            </div>
        </article>
    );
}

import { PBRMaterial, Texture, Color3, Scene, MeshBuilder, StandardMaterial } from "@babylonjs/core";

export const texturesAll = [
    {
        name: "leather1",
        forTarget: ["base_1"], //Целевая замена материала
        texture: "/textures/leather/leather-002-irish-coffee_d.jpg",
        normale: "/textures/leather/leather-002_n.png",
        about: "Обычная кожа — это натуральный материал, производимый из шкур животных (чаще всего коров, свиней, коз или овец) путем дубления. Она широко используется благодаря своей доступности, универсальности и отличным эксплуатационным характеристикам.",
    },
    {
        name: "leather2",
        forTarget: ["base_1"],
        normale: "/textures/leather2/leather-023_n.png",
        texture: "/textures/leather2/leather-023-brown_d.jpg",
        about: "Крокодиловая кожа — это премиальный материал, получаемый из кожи крокодилов, аллигаторов или кайманов. Она известна своей уникальной текстурой, высокой прочностью и долговечностью. Благодаря своей эстетике и редкости, крокодиловая кожа считается символом роскоши и часто используется в производстве аксессуаров высокого класса.",
    },
    {
        name: "wood",
        forTarget: ["base_2", "base_3"],
        normale: "/textures/wood/oak_veneer_01_nor_gl_1k.png",
        texture: "/textures/wood/oak_veneer_01_diff_1k.jpg",
        about: "ДСП (древесно-стружечная плита) — это популярный древесный материал, изготавливаемый из спрессованных древесных стружек с добавлением связующих компонентов (чаще всего синтетических смол). Благодаря своей доступности и универсальности, ДСП широко применяется в мебельной индустрии и строительстве.",
    },
    {
        name: "wood2",
        forTarget: ["base_2", "base_3"],
        normale: "/textures/wood2/wood-131_aspen-240x060cm_n.png",
        texture: "/textures/wood2/wood-131_aspen-240x060cm-color1_d.jpg",
        about: "ДСП (древесно-стружечная плита) — это популярный древесный материал, изготавливаемый из спрессованных древесных стружек с добавлением связующих компонентов (чаще всего синтетических смол). Благодаря своей доступности и универсальности, ДСП широко применяется в мебельной индустрии и строительстве.",
    },
    {
        name: "wood3",
        forTarget: ["base_2", "base_3"],
        normale: "/textures/wood3/wood-130_aspen-240x060cm_n.png",
        texture: "/textures/wood3/wood-130_aspen-240x060cm-color1_d.jpg",
        about: "ДСП (древесно-стружечная плита) — это популярный древесный материал, изготавливаемый из спрессованных древесных стружек с добавлением связующих компонентов (чаще всего синтетических смол). Благодаря своей доступности и универсальности, ДСП широко применяется в мебельной индустрии и строительстве.",
    },
    // {
    //     name: "fabric1",
    //     forTarget: ["base_1"],
    //     normale: "",
    //     texture: "/textures/fabric1/lambre01_1900x900.jpg",
    // },
    {
        name: "fabric2",
        forTarget: ["base_1"],
        normale: "/textures/fabric2/fabric-002_basket-weave-100x100cm_n.png",
        texture: "/textures/fabric2/fabric-002_basket-weave-100x100cm_b.png",
        about: "Ткань — это материал, созданный из переплетения нитей или волокон. Она может быть натуральной, синтетической или смешанной, что определяет её свойства и области применения. Ткань является основой для производства одежды, домашнего текстиля, мебели и технических изделий.",
    },
    {
        name: "fabric3",
        forTarget: ["base_1"],
        normale: "/textures/fabric3/fabric-043_twining-weave-100x100cm_n.png",
        texture: "/textures/fabric3/fabric-043_twining-weave-100x100cm_s.png",
        about: "Ткань — это материал, созданный из переплетения нитей или волокон. Она может быть натуральной, синтетической или смешанной, что определяет её свойства и области применения. Ткань является основой для производства одежды, домашнего текстиля, мебели и технических изделий.",
    },
    {
        name: "fabric4",
        forTarget: ["base_1"],
        normale: "/textures/fabric4/fabric-040_taffeta-creased-100x100cm_n.png",
        texture: "/textures/fabric4/fabric-040_taffeta-creased-100x100cm_s.png",
        about: "Ткань — это материал, созданный из переплетения нитей или волокон. Она может быть натуральной, синтетической или смешанной, что определяет её свойства и области применения. Ткань является основой для производства одежды, домашнего текстиля, мебели и технических изделий.",
    },
    {
        name: "fabric5",
        forTarget: ["base_1"],
        normale: "/textures/fabric5/fabric-039_silk-tussah-100x100cm_n.png",
        texture: "/textures/fabric5/fabric-039_silk-tussah-100x100cm_s.png",
        about: "Ткань — это материал, созданный из переплетения нитей или волокон. Она может быть натуральной, синтетической или смешанной, что определяет её свойства и области применения. Ткань является основой для производства одежды, домашнего текстиля, мебели и технических изделий.",
    },
] as const;

export type TexturesAllKeys = (typeof texturesAll)[number]["name"];

export function createMaterial({ scene, textureName, materialName, baseColor }: { scene: Scene; textureName: TexturesAllKeys; materialName: string; baseColor?: Color3 }): PBRMaterial | StandardMaterial {
    //Находим текстуру по имени
    const textureCurrent = texturesAll.find((text) => text.name === textureName)!;

    // //Создаем новый материал с именем которого меняем
    const material = new PBRMaterial(materialName, scene);

    // Цвет/текстура материала

    //material.albedoColor = new Color3(0.01, 0.01, 0.01); // Почти черный для реалистичности

    if (baseColor) {
        material.albedoColor = baseColor;
    }

    //Текстура материала
    material.albedoTexture = new Texture(textureCurrent.texture, scene);

    // Текстура шероховатости (roughness) и нормалей (bump)
    //material.bumpTexture = new Texture("/textures/leather/leather-002_n.png", scene); // Нормали для текстуры кожи
    if (textureCurrent.normale) {
        material.bumpTexture = new Texture(textureCurrent.normale, scene); // Нормали для текстуры кожи
        material.bumpTexture.level = 1.2; // Усиление эффекта рельефа
    }

    material.metallic = 0.1; // Низкая металличность
    material.roughness = 0.8; // Высокая шероховатость для матового эффекта

    // Отражения окружения (если есть HDR)
    material.environmentIntensity = 0.5; // Мягкое отражение света из окружения

    // Контрастный эффект света (опционально)
    material.specularIntensity = 0.3;

    // WITH STANDART MATERIAL

    // const material = new StandardMaterial(materialName, scene);

    // // Текстура кожи
    // material.diffuseTexture = new Texture(textureCurrent.texture, scene);

    // // Нормали (рельеф)
    // if (textureCurrent.normale) {
    //     material.bumpTexture = new Texture(textureCurrent.normale, scene);
    // }

    // // Зеркальность
    // material.specularPower = 64; // Блеск
    // material.specularColor = new Color3(0.1, 0.1, 0.1); // Мягкий блик

    return material;
}

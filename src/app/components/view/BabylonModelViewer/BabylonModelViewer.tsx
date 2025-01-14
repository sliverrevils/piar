"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Engine, Scene, SceneLoader, ArcRotateCamera, HemisphericLight, Vector3, AnimationGroup, PointerEventTypes, ArcRotateCameraPointersInput, StandardMaterial, Color3, PBRMaterial, Texture, AbstractMesh, HDRCubeTexture, MeshBuilder, Mesh } from "@babylonjs/core";
import "@babylonjs/loaders";
import { createMaterial, texturesAll, TexturesAllKeys } from "./materials";
import Image from "next/image";
import ColorPicker from "../../common/ColorPicker/ColorPicker";
import styles from "./babylon.module.scss";
import { getAnimationText } from "./animationsInfo";
import { setCameraToSceneBounds } from "../../../../../utils/babyloneUtils";
import {} from "@heroicons/react";
import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";

// В имени мэша до # название её анимации (mech#1  - значит анимация mech) - мэш называем до # как название анимации которая играет по клику на мэш (т.к. мэшей может быть много в одной анимации)
// Текстуры base_1, base_2 ... для смены
// Название проигранных анимация сохраняются в массиве playedAnimsRef (что бы в следующий раз играть обратную анимацию) и в стэйте playedAnimations (стэйт только для обновления кнопок в HTML)

//Центр камеры просчитывается автоматически по размерам всех мэшей (внешнии функции)
const BabylonModelWithAnimation: React.FC<{
    modelPath: string;
    hdrPath?: string;
    baseFone?: boolean;
    roomPath?: string;
    base1Material?: TexturesAllKeys;
    base2Material?: TexturesAllKeys;
    base3Material?: TexturesAllKeys;
    initColor?: string;
}> = ({ modelPath, hdrPath, baseFone = false, roomPath, base1Material, base2Material, base3Material, initColor }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<Scene | null>(null);
    const playedAnimsRef = useRef<string[]>([]); //! еще раз записываем все проигранные анимации в реф , потому что стэйт не обновляется в обработчике канваса
    const [playedAnimations, setPlayedAnimations] = useState<string[]>([]); //! а тут все проигранные только для кнопок в HTML
    const isDelegation = useRef<boolean>(false);
    const [animationGroups, setAnimationGroups] = useState<AnimationGroup[]>([]);
    const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
    //const [playedAnims, setPlayedAnims] = useState<string[]>([]);
    const engineRef = useRef<Engine | null>(null);
    const [meshesArr, setMeshesArr] = useState<AbstractMesh[]>([]);

    const [baseColor, setBaseColor] = useState<Color3>(Color3.FromHexString(initColor || "#ffffff"));

    const [fullScreen, setFullscreen] = useState(false);
    const [isAnimPanel, setIsAnimPanel] = useState(false);

    //! Функция при зменении размеров экрана
    const winResize = () => engineRef.current && engineRef.current.resize();

    //! Функция для запуска выбранной анимации
    const playAnimation = (animationName: string) => {
        console.log("🔄️", playedAnimations);
        // console.log(playedAnimsRef.current);
        if (!sceneRef.current || !sceneRef.current.animationGroups.length) return;
        const { animationGroups } = sceneRef.current;

        //animationGroups.forEach((anim) => anim.stop()); //all stop
        const selected = animationGroups.find((anim) => anim.name === animationName);
        if (selected) {
            if (playedAnimsRef.current.includes(animationName)) {
                selected.speedRatio = -1;
                playedAnimsRef.current = [...playedAnimsRef.current.filter((animName) => animName !== animationName)];
                setPlayedAnimations((state) => [...state.filter((animName) => animName !== animationName)]);
            } else {
                selected.speedRatio = 1;
                playedAnimsRef.current = [...playedAnimsRef.current, animationName];
                setPlayedAnimations((state) => [...state, animationName]);
            }
            // console.log(`playedAnims`, playedAnimsRef.current);
            selected.play(false);
        }
    };

    //!Смена материала по имени
    const changeMaterialByName = useCallback(
        ({ targetMaterialName, materialKey, changeColor = false }: { targetMaterialName: string; materialKey: TexturesAllKeys; changeColor?: boolean }) => {
            const newMaterial = createMaterial({ scene: sceneRef.current!, textureName: materialKey, materialName: targetMaterialName, baseColor: changeColor ? baseColor : undefined });
            meshesArr.forEach((mesh) => {
                if (mesh.material && mesh.material.name === targetMaterialName) {
                    mesh.material = newMaterial;
                }
            });
        },
        [meshesArr, baseColor]
    );
    //! Смена базового цвета
    const changeMaterialColor = ({ targetMaterialName, newColor }: { targetMaterialName: string; newColor: Color3 }) => {
        meshesArr
            .filter((mesh) => mesh.material?.name === targetMaterialName)
            .forEach(({ material }) => {
                //console.log(material);
                if (material) {
                    (material as PBRMaterial).albedoColor = newColor;
                }
            });
    };

    //TODO обработка событий на канвасе
    if (sceneRef.current && !isDelegation.current) {
        isDelegation.current = true;
        // что бы не сробатывала анимация при случайном клике или вращении камеры
        let hit: string = "";
        let timeout: NodeJS.Timeout | undefined;
        sceneRef.current.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
                const mesh = pointerInfo.pickInfo?.pickedMesh;
                timeout && clearTimeout(timeout);
                if (mesh) {
                    hit = mesh.name;
                    timeout = setTimeout(() => {
                        hit = "";
                    }, 300);
                }
            }
            if (pointerInfo.type === PointerEventTypes.POINTERUP) {
                // console.log(pointerInfo);
                const mesh = pointerInfo.pickInfo?.pickedMesh;
                if (mesh) {
                    const animName = mesh.name.split("#")[0];
                    // console.log(animName, playAnimation);
                    if (hit === mesh.name) playAnimation(animName);
                }
            }
        });
    }

    //Главный эффект
    useEffect(() => {
        if (!canvasRef.current || sceneRef.current) return;

        //! Создаем движок Babylon.js
        const engine = new Engine(canvasRef.current, true, { alpha: true });
        engineRef.current = engine;

        //! Создаем сцену
        const scene = new Scene(engine);
        sceneRef.current = scene;

        //Фон c полом
        if (baseFone) {
            scene.createDefaultEnvironment();
        }

        //! Добавляем камеру
        const camera = new ArcRotateCamera(
            "camera",
            Math.PI / 1.6, // Угол вращения по горизонтали
            Math.PI / 2.5, // Угол вращения по вертикали
            3, // Расстояние от камеры до цели
            new Vector3(0, 0.5, 0), // Начальная точка фокусировки (сместили вниз)
            scene
        );

        camera.wheelDeltaPercentage = 0.01; // Уменьшение значения делает скролл более плавным
        camera.pinchDeltaPercentage = 0.01; // Для плавного изменения масштаба при жестах
        // Настройка скролла
        camera.wheelPrecision = 100; // Мягкость приближения
        camera.wheelDeltaPercentage = 0.01; // Плавность изменения масштаба
        camera.inertia = 0.8; // Инерция для плавности

        // Ограничение приближения
        // camera.lowerRadiusLimit = 3;
        // camera.upperRadiusLimit = 7;

        camera.upperBetaLimit = Math.PI / 2; // Максимальный угол (горизонтальный вид) // Запрещаем смотреть снизу

        camera.attachControl(canvasRef.current, true);

        //! Назначаем HDR как текстуру окружения
        if (hdrPath) {
            const hdrTexture = new HDRCubeTexture(hdrPath, scene, 512);
            scene.environmentTexture = hdrTexture;

            // Скайбокс для отображения HDR-фона
            const skybox = MeshBuilder.CreateBox("skyBox", { size: 100 }, scene);
            const skyboxMaterial = new StandardMaterial("skyBoxMaterial", scene);
            skyboxMaterial.backFaceCulling = false; // Включаем внутренние стороны
            skyboxMaterial.reflectionTexture = hdrTexture; // Используем HDR как текстуру
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE; // Устанавливаем режим скайбокса
            skybox.material = skyboxMaterial;

            scene.environmentIntensity = 0.1; // Уменьшает яркость HDR-освещения
        }

        //! Добавляем свет
        new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        //! Загружаем модель
        SceneLoader.ImportMesh("", "", modelPath, scene, (meshes, particleSystems, skeletons, animGroups) => {
            setCameraToSceneBounds(scene, camera);

            console.log("Model loaded with animations", animGroups);

            // Останавливаем все анимации изначально
            animGroups.forEach((anim) => anim.stop());
            setAnimationGroups(animGroups); // Сохраняем анимации в state
            // console.log("Meshes 🤖", scene.meshes);
            setMeshesArr(scene.meshes);

            //меняем материал если указан в компоненте начальный
            if (base1Material) {
                const newMaterial = createMaterial({
                    scene: sceneRef.current!,
                    textureName: base1Material,
                    materialName: "base_1",
                    baseColor: initColor ? Color3.FromHexString(initColor) : undefined,
                    // baseColor: changeColor ? baseColor : undefined
                });
                meshes.forEach((mesh) => {
                    if (mesh.material && mesh.material.name === "base_1") {
                        mesh.material = newMaterial;
                    }
                });
            }
            if (base2Material) {
                const newMaterial = createMaterial({
                    scene: sceneRef.current!,
                    textureName: base2Material,
                    materialName: "base_2",
                    // baseColor: changeColor ? baseColor : undefined
                });
                meshes.forEach((mesh) => {
                    if (mesh.material && mesh.material.name === "base_2") {
                        mesh.material = newMaterial;
                    }
                });
            }
            if (base3Material) {
                const newMaterial = createMaterial({
                    scene: sceneRef.current!,
                    textureName: base3Material,
                    materialName: "base_3",
                    // baseColor: changeColor ? baseColor : undefined
                });
                meshes.forEach((mesh) => {
                    if (mesh.material && mesh.material.name === "base_3") {
                        mesh.material = newMaterial;
                    }
                });
            }
        });
        //! Загружаем комнату
        if (roomPath) {
            SceneLoader.ImportMesh("", "", roomPath, scene);
        }

        // //TODO обработка событий на канвасе

        //TODO смена групповой текстуры
        let baseMaterial = scene.getMaterialByName("base_1") as StandardMaterial;
        if (baseMaterial) {
            const standartMaterial = new StandardMaterial("standartMaterial", scene);
            baseMaterial.diffuseColor = new Color3(1, 0, 0);
        }

        //! Настройка прозрачности сцены
        if (!hdrPath) {
            //если нет HDR
            scene.clearColor.set(0, 0, 0, 0); // RGBA (0,0,0,0) — полностью прозрачный
        }

        //! Запускаем рендеринг
        engine.runRenderLoop(() => {
            scene.render();
        });

        //! Отслеживаем изменение экрана
        window.addEventListener("resize", winResize);

        //! Отключаем скролл страницы при наведении на canvas
        const disableScroll = (event: WheelEvent) => {
            event.preventDefault(); // Блокировка прокрутки страницы
        };
        canvasRef.current.addEventListener("wheel", disableScroll);

        //! Очистка ресурсов при размонтировании
        return () => {
            window.removeEventListener("resize", winResize);
            canvasRef.current?.removeEventListener("resize", winResize);
            scene.dispose();
            engine.dispose();
        };
    }, []);

    //Эффект смены цвета
    useEffect(() => {
        //console.log("Change to", baseColor);
        changeMaterialColor({ targetMaterialName: "base_1", newColor: baseColor });
    }, [baseColor]);

    //Эффект ролного экрана (что бы модель была четкая)
    useEffect(() => {
        winResize();
        document.body.style.overflow = fullScreen ? "hidden" : "auto";
    }, [fullScreen]);

    //!MEMOS
    //animations block
    const animationBlockMemo = useMemo(() => {
        return (
            fullScreen && (
                <div className={styles.animationsBlock}>
                    <div className={styles.animBlockBtn} onClick={() => setIsAnimPanel((state) => !state)}>
                        <Cog6ToothIcon width={20} height={20} />
                        {isAnimPanel ? <ChevronDoubleLeftIcon width={20} /> : <ChevronDoubleRightIcon width={20} />}
                    </div>

                    {animationGroups.map((animation) => (
                        <div key={animation.name + "_anim"} className={`${styles.animationItem} ${playedAnimations.includes(animation.name) ? styles.animationPlayed : ""} ${isAnimPanel ? "" : styles.animationItemClosed}`} onClick={() => playAnimation(animation.name)}>
                            <span>{getAnimationText({ animationName: animation.name, played: playedAnimations.includes(animation.name) })}</span>
                        </div>
                    ))}
                </div>
            )
        );
    }, [animationGroups, playedAnimations, isAnimPanel, fullScreen]);

    //full screen button
    const fullScreenBtnMemo = useMemo(() => {
        return (
            <div className={styles.fullScreenBtn} onClick={() => setFullscreen((state) => !state)}>
                <div className={styles.text}>{fullScreen ? "" : "На весь экран"}</div>
                {fullScreen ? <XCircleIcon width={30} height={30} /> : <CubeTransparentIcon width={25} height={25} />}
            </div>
        );
    }, [fullScreen]);

    //material block HTML
    const materialsBlockMemo = useMemo(() => {
        return (
            fullScreen && (
                <div className={styles.materialPanel}>
                    {/* <select onChange={(e) => playAnimation(e.target.value)} value={selectedAnimation || ""} style={{ padding: "5px", fontSize: "1rem" }}>
                    <option value="" disabled>
                        Выберите анимацию
                    </option>
                    {animationGroups.map((anim) => (
                        <option key={anim.name} value={anim.name}>
                            {anim.name}
                        </option>
                    ))}
                </select> */}

                    <div className={styles.materialBlock}>
                        <div className={styles.title}>Обивка</div>
                        <div className={styles.materialsList}>
                            {texturesAll
                                .filter((textItem) => [...textItem.forTarget].includes("base_1"))
                                .map((textureItem) => (
                                    <div key={textureItem.name} className={styles.materialItem} onClick={() => changeMaterialByName({ targetMaterialName: "base_1", materialKey: textureItem.name, changeColor: true })}>
                                        <div className={styles.imgWrap}>
                                            <Image src={textureItem.texture} alt="key" width={300} height={300} />
                                        </div>
                                        <div className={styles.materialName}>{textureItem.name}</div>
                                        <div className={styles.materialAboutBlock}>
                                            <div className={styles.name}>{textureItem.name}</div>
                                            <Image src={textureItem.texture} alt="key" width={300} height={300} />
                                            <div className={styles.aboutText}>{textureItem.about}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className={styles.materialBlock}>
                        <div className={styles.title}>Внешний материал</div>
                        <div className={styles.materialsList}>
                            {texturesAll
                                .filter((textItem) => [...textItem.forTarget].includes("base_2"))
                                .map((textureItem) => (
                                    <div key={textureItem.name} className={styles.materialItem} onClick={() => changeMaterialByName({ targetMaterialName: "base_2", materialKey: textureItem.name })}>
                                        <div className={styles.imgWrap}>
                                            <Image src={textureItem.texture} alt="key" width={300} height={300} />
                                        </div>
                                        <div className={styles.materialName}>{textureItem.name}</div>
                                        <div className={styles.materialAboutBlock}>
                                            <div className={styles.name}>{textureItem.name}</div>
                                            <Image src={textureItem.texture} alt="key" width={300} height={300} />
                                            <div className={styles.aboutText}>{textureItem.about}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className={styles.materialBlock}>
                        <div className={styles.title}>Внутренний материал</div>
                        <div className={styles.materialsList}>
                            {texturesAll
                                .filter((textItem) => [...textItem.forTarget].includes("base_3"))
                                .map((textureItem) => (
                                    <div key={textureItem.name} className={styles.materialItem} onClick={() => changeMaterialByName({ targetMaterialName: "base_3", materialKey: textureItem.name })}>
                                        <div className={styles.imgWrap}>
                                            <Image src={textureItem.texture} alt="key" width={300} height={300} />
                                        </div>
                                        <div className={styles.materialName}>{textureItem.name}</div>
                                        <div className={styles.materialAboutBlock}>
                                            <div className={styles.name}>{textureItem.name}</div>
                                            <Image src={textureItem.texture} alt="key" width={300} height={300} />
                                            <div className={styles.aboutText}>{textureItem.about}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )
        );
    }, [fullScreen]);

    //colorPicker block HTML
    const colorPickerMemo = useMemo(() => {
        return (
            fullScreen && (
                <div className={styles.colorPickerBlock}>
                    <ColorPicker setBaseColor={setBaseColor} initColor={initColor} />
                </div>
            )
        );
    }, [fullScreen]);
    return (
        <div className={`${styles.babyloneMainWrap} ${fullScreen ? styles.babyloneFullScreen : ""}`}>
            <canvas ref={canvasRef} />
            {colorPickerMemo}
            {animationBlockMemo}
            {fullScreenBtnMemo}
            {materialsBlockMemo}
        </div>
    );
};

export default BabylonModelWithAnimation;

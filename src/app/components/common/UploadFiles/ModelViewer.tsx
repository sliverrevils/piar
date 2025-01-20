import React, { useEffect, useRef } from "react";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader, Color3 } from "@babylonjs/core";
import "@babylonjs/loaders"; // Поддержка загрузки .glb/.gltf файлов

interface BabylonViewerProps {
    file: File | null; // Файл, переданный из input
}

export const PreviewModel: React.FC<BabylonViewerProps> = ({ file }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sceneRef = useRef<Scene | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Инициализация Babylon.js
        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);
        sceneRef.current = scene;

        // Настройка камеры
        const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 1, 0), scene);
        camera.attachControl(canvasRef.current, true);

        // Добавление света
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.8;

        // Установка цвета фона сцены
        //scene.clearColor = new Color3(0.9, 0.9, 0.9);

        // Рендер сцены
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Очистка ресурсов при размонтировании компонента
        return () => {
            scene.dispose();
            engine.dispose();
        };
    }, []);

    useEffect(() => {
        // Загрузка модели из файла
        const loadModel = async () => {
            if (file && sceneRef.current) {
                const scene = sceneRef.current;
                const reader = new FileReader();

                reader.onload = async (e) => {
                    const arrayBuffer = e.target?.result;
                    if (arrayBuffer) {
                        try {
                            // Загружаем ассеты в контейнер из ArrayBuffer
                            const assetContainer = await SceneLoader.LoadAssetContainerAsync("", undefined, scene, undefined, file.name, arrayBuffer as string);

                            // Добавляем все ассеты в сцену
                            assetContainer.addAllToScene();
                        } catch (error) {
                            console.error("Ошибка при загрузке модели:", error);
                        }
                    }
                };

                reader.readAsArrayBuffer(file); // Чтение файла как ArrayBuffer
            }
        };

        loadModel();
    }, [file]);

    if (!file) return;

    return <canvas ref={canvasRef} style={{ width: "400px", height: "300px" }} />;
};

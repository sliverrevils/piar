"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

interface ThreeModelViewerProps {
    modelPath: string;
}

let mixer: THREE.AnimationMixer; // Для управления анимацией
let clock = new THREE.Clock(); // Для отслеживания времени

const ThreeModelViewer: React.FC<ThreeModelViewerProps> = ({ modelPath }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        //подстраиваемся под размеры родителя
        const widthParent = mountRef.current.parentElement?.clientWidth!;
        const heightParent = mountRef.current.parentElement?.clientHeight!;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, widthParent / heightParent, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        let composer: EffectComposer;
        renderer.setSize(widthParent, heightParent);
        //renderer.setSize(widthParent, heightParent);
        mountRef.current.appendChild(renderer.domElement);

        // Добавляем освещение
        const ambientLight = new THREE.AmbientLight(0x404040, 10); // Свет окружения
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 10);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // Загружаем модель GLTF
        const loader = new GLTFLoader();
        loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            scene.add(model);
            console.log("GLTF", gltf);

            // Создаем AnimationMixer для модели
            mixer = new THREE.AnimationMixer(model);

            // Запускаем первую анимацию из загруженных
            if (gltf.animations.length > 0) {
                const action = mixer.clipAction(gltf.animations[0]); // Берем первую анимацию
                action.play(); // Запускаем анимацию
            }
        });

        // Загружаем HDRI
        const loaderHDRI = new RGBELoader();
        loaderHDRI.load("/hdri/studio_small_09_2k.hdr", (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture; // Использовать для глобального освещения
            scene.background = texture; // Для окружения
        });

        // Начальное положение камеры
        camera.position.z = 5;

        // Добавляем управление камерой
        const controls = new OrbitControls(camera, renderer.domElement);

        // Создание эффекта постобработки с RenderPass
        const renderPass = new RenderPass(scene, camera);

        // Создание эффекта FXAA с ShaderPass
        const fxaaPass = new ShaderPass(FXAAShader);
        fxaaPass.uniforms["resolution"].value.set(1 / widthParent, 1 / heightParent); // Настроим разрешение для FXAA

        // Создание EffectComposer для обработки постэффектов
        composer = new EffectComposer(renderer);
        composer.addPass(renderPass); // Добавляем рендер пас
        composer.addPass(fxaaPass); // Добавляем FXAA пас для сглаживания

        //! Функции

        const resizeWin = () => {
            renderer.setSize(widthParent, heightParent);
            camera.aspect = widthParent / heightParent;
            camera.updateProjectionMatrix();
            composer.setSize(widthParent, heightParent);
            fxaaPass.uniforms["resolution"].value.set(1 / widthParent, 1 / heightParent);
        };

        const animate = () => {
            requestAnimationFrame(animate);
            // Обновляем анимацию
            if (mixer) {
                const delta = clock.getDelta(); // Время с последнего кадра
                mixer.update(delta); // Обновление AnimationMixer
            }
            controls.update();
            renderer.render(scene, camera);
        };

        animate();
        window.addEventListener("resize", resizeWin);

        // Очистка
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            window.removeEventListener("resize", resizeWin);
        };
    }, [modelPath]);

    return <div ref={mountRef} />;
};

export default ThreeModelViewer;

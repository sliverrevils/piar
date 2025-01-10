import { Mesh, Scene, Vector3, ArcRotateCamera } from "@babylonjs/core";

// Функция для расчёта общего bounding box
export function calculateSceneBounds(meshes: Mesh[]): { min: Vector3; max: Vector3; center: Vector3 } {
    let min = new Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    let max = new Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

    meshes.forEach((mesh) => {
        if (!mesh.getBoundingInfo) return; // Пропускаем меши без информации о границах

        const boundingInfo = mesh.getBoundingInfo();
        const meshMin = boundingInfo.boundingBox.minimumWorld;
        const meshMax = boundingInfo.boundingBox.maximumWorld;

        min = Vector3.Minimize(min, meshMin);
        max = Vector3.Maximize(max, meshMax);
    });

    const center = min.add(max).scale(0.5); // Рассчитываем центр как среднюю точку
    return { min, max, center };
}

// Установка центра вращения и ограничений для камеры
export function setCameraToSceneBounds(scene: Scene, camera: ArcRotateCamera) {
    const meshes = scene.meshes.filter((mesh) => mesh.isVisible); // Берём только видимые меши
    if (meshes.length === 0) return;

    const { min, max, center } = calculateSceneBounds(meshes as Mesh[]);

    // Устанавливаем центр вращения камеры
    camera.target = center;

    // Рассчитываем радиус для ограничения приближения
    const sceneSize = max.subtract(min);
    const boundingRadius = sceneSize.length() / 2;

    // Ограничиваем минимальное расстояние
    camera.lowerRadiusLimit = boundingRadius * 1.4; // Немного больше радиуса для запаса
}

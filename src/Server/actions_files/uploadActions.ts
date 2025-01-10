"use server";

import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

//! сохранение файла
export async function saveFileAction(file: File): Promise<string> {
    // Убедимся, что папка /uploads существует
    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
        console.error("Не удалось создать папку /uploads:", error);
        throw new Error("Ошибка при создании папки для загрузки");
    }

    const filePath = path.join(UPLOAD_DIR, file.name);

    // Читаем содержимое файла и записываем его
    try {
        const buffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));
        return filePath; // Возвращаем путь сохраненного файла
    } catch (error) {
        console.error("Ошибка при сохранении файла:", error);
        throw new Error("Ошибка при сохранении файла");
    }
}

//! удаление файла
export async function deleteFileAction(filename: string): Promise<string> {
    if (!filename) {
        throw new Error("Имя файла не указано.");
    }

    const filePath = path.join(UPLOAD_DIR, filename);

    try {
        // Проверяем, существует ли файл
        await fs.access(filePath);

        // Удаляем файл
        await fs.unlink(filePath);
        return `Файл ${filename} успешно удалён.`;
    } catch (error: any) {
        if (error.code === "ENOENT") {
            throw new Error(`Файл ${filename} не найден.`);
        } else {
            console.error("Ошибка при удалении файла:", error);
            throw new Error("Ошибка при удалении файла.");
        }
    }
}

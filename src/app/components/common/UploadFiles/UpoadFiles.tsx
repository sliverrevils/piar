"use client";

import { deleteFileAction, saveFileAction } from "@/Server/actions_files/uploadActions";
import React, { useState } from "react";

export default function UploadForm() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [fileType, setFileType] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setFileType(`➡️ ${file.name},\n ${file.type},\n ${file.size} `);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedFile) {
            setStatus("Пожалуйста, выберите файл.");
            return;
        }

        try {
            const filePath = await saveFileAction(selectedFile);
            setStatus(`Файл успешно сохранён: ${filePath}`);
        } catch (error: any) {
            setStatus(`Ошибка: ${error.message}`);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>{fileType}</div>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Загрузить</button>
                {status && <p>{status}</p>}
            </form>
            <button
                onClick={async () => {
                    deleteFileAction("Players.txt");
                }}
            >
                del
            </button>
        </>
    );
}

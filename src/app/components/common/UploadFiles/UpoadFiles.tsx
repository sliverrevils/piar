"use client";

import { deleteFileAction, saveFileAction } from "@/Server/actions_files/uploadActions";
import React, { useState } from "react";
import BabylonModelWithAnimation from "../../view/BabylonModelViewer/BabylonModelViewer";
import { PreviewModel } from "./ModelViewer";

export default function UploadForm({ type }: { type: "3d" | "images" }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [fileType, setFileType] = useState("");
    const [modelArrayBuffer, setModelArrayBuffer] = useState<ArrayBuffer | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setFileType(`➡️ ${file.name},\n ${file.type},\n ${file.size} `);
            // if (type === "3d") {
            //     const reader = new FileReader();
            //     reader.onload = (e) => {
            //         const arrayBuffer = e.target?.result;
            //         if (arrayBuffer) {
            //             setModelArrayBuffer(arrayBuffer as ArrayBuffer);
            //         }
            //     };
            // }
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
            <PreviewModel file={selectedFile} />
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

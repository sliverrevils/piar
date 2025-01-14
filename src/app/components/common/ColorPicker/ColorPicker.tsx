"use client";

import React, { useState, useEffect } from "react";
import { Color3 } from "@babylonjs/core";
import styles from "./colPicker.module.scss";

// Хук для debounce
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler); // Очистка таймера
    }, [value, delay]);

    return debouncedValue;
}

// Компонент выбора цвета
const ColorPicker = ({ setBaseColor, initColor }: { setBaseColor: React.Dispatch<React.SetStateAction<Color3>>; initColor?: string }) => {
    const [color, setColor] = useState<Color3>(Color3.FromHexString(initColor || "#ffffff"));
    const [hexColor, setHexColor] = useState<string>(initColor || "#ffffff");

    // Debounced цвет
    const debouncedColor = useDebounce(hexColor, 300); // 300 мс задержка

    // Обновление состояния цвета в формате Color3
    useEffect(() => {
        const newColor = Color3.FromHexString(debouncedColor);
        setColor(newColor);
        setBaseColor(newColor);
    }, [debouncedColor]);

    // Обработчик изменения цвета
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHexColor(e.target.value); // Обновляем HEX-цвет (моментально)
    };

    return (
        <label className={styles.colPickerWrap}>
            {/* <label htmlFor="colorPicker">Выберите базовый цвет цвет:</label> */}
            <div className={styles.text}>Базовый цвет </div>
            <div className={styles.colBox} style={{ background: hexColor }}></div>
            <input
                id="colorPicker"
                type="color"
                value={hexColor} // Выводим текущий HEX-цвет
                onChange={handleColorChange}
            />
            {/* <p>
                HEX: <b>{hexColor}</b>
            </p>
            <p>
                Color3: <b>{color.toString()}</b>
            </p> */}
        </label>
    );
};

export default ColorPicker;

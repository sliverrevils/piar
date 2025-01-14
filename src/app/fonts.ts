import { Caveat, Roboto, Tektur, Rubik_Dirt, Oleo_Script } from "next/font/google";

export const caveatFont = Caveat({
    subsets: ["latin"],
    weight: ["400", "700"], // Обычный и жирный
});

export const robotoFont = Roboto({
    subsets: ["latin"],
    weight: ["400", "700"], // Обычный и жирный
});
export const tekturFont = Tektur({
    subsets: ["latin"],
    weight: ["400", "700"], // Обычный и жирный
});

export const rubik = Rubik_Dirt({
    subsets: ["cyrillic"],
    weight: ["400"],
});

export const priceFont = Oleo_Script({
    subsets: ["latin"],
    weight: ["400", "700"],
});

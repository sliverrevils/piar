type TAnimationsInfo = Record<
    string,
    {
        start: string;
        played: string;
    }
>;

const animationsInfo: TAnimationsInfo = {
    mech: {
        start: "Разложить спальное место",
        played: "Собрать спальное место",
    },
    attom: {
        start: "Поднять аттоманку",
        played: "Опустить аттоманку",
    },
    puffs: {
        start: "Убрать основные подушки",
        played: "Вернуть основные подушки",
    },
    puffsMini: {
        start: "Убрать маленькие подушки",
        played: "Вернуть маленькие подушки",
    },
    table: {
        start: "Поднять стол",
        played: "Опустить стол",
    },
};

export const getAnimationText = ({ animationName, played }: { animationName: string; played: boolean }) => {
    if (!animationsInfo[animationName]) return animationName + " ⚠️";

    return animationsInfo[animationName][played ? "played" : "start"];
};

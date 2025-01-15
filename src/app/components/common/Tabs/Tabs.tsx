"use client";
import { useEffect, useState } from "react";
import styles from "./tabs.module.scss";
import { caveatFont } from "@/app/fonts";

const initStates = {
    help: true,
};

export default function Tabs({ children }: { children: { name: string; node: React.ReactNode; about: string }[] }) {
    const [selectedTabIdex, setSelectedTabIndex] = useState(0);
    const [isSelectedTab, setIsSelectedTab] = useState(false);

    useEffect(() => {
        if (!initStates.help) {
            setIsSelectedTab(true);
        } else {
            initStates.help = false;
        }
    }, [selectedTabIdex]);
    return (
        <div className={styles.tabsWrap}>
            <div className={styles.tabsBlock}>
                {children.map(({ name }, idx) => (
                    <div key={name + "_tabsKeys"} style={{ ...caveatFont.style, lineHeight: 1, fontSize: 20 }} className={`${styles.tabItem} ${selectedTabIdex === idx ? styles.selectedTab : ""}`} onClick={() => setSelectedTabIndex(idx)} onMouseMove={() => selectedTabIdex === idx && setIsSelectedTab(true)} onMouseLeave={() => setIsSelectedTab(false)}>
                        {name}
                    </div>
                ))}
            </div>
            {isSelectedTab && <div className={styles.helpBlock}>{children[selectedTabIdex].about}</div>}
            <div className={styles.contentBlock} onMouseMove={() => setIsSelectedTab(false)}>
                {children.map((item, idx) => (
                    <div key={item.name + "main"} style={{ display: selectedTabIdex === idx ? "block" : "none" }}>
                        {item.node}
                    </div>
                ))}
            </div>
        </div>
    );
}

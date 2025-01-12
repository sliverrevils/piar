"use client";
import { useState } from "react";
import styles from "./tabs.module.scss";

export default function Tabs({ children }: { children: { name: string; node: React.ReactNode }[] }) {
    const [selectedTabIdex, setSelectedTabIndex] = useState(0);
    return (
        <div className={styles.tabsWrap}>
            <div className={styles.tabsBlock}>
                {children.map(({ name }, idx) => (
                    <div key={name + "_tabsKeys"} className={`${styles.tabItem} ${selectedTabIdex === idx ? styles.selectedTab : ""}`} onClick={() => setSelectedTabIndex(idx)}>
                        {name}
                    </div>
                ))}
            </div>
            <div className={styles.contentBlock}>
                {children.map((item, idx) => (
                    <div style={{ display: selectedTabIdex === idx ? "block" : "none" }}>{item.node}</div>
                ))}
            </div>
        </div>
    );
}

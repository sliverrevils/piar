"use client";
import styles from "./slider.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Mousewheel, Scrollbar } from "swiper/modules";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/outline";

const SliderWithThumbnails = ({ children }: { children: React.ReactNode[] }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [fullScreen, setFullScreen] = useState(false);

    return (
        <div className={`${fullScreen ? styles.sliderWrapFullScreen : ""} ${styles.sliderWrap} `}>
            {fullScreen && <XCircleIcon width={30} className={styles.fullScreenCloseBtn} onClick={() => setFullScreen(false)} />}

            <div className={`${styles.slider} ${styles.leftSlider}`}>
                <div className={`${styles.prevBtn} prevLeftBtn`}>
                    <ChevronUpIcon width={20} height={20} />
                </div>
                <Swiper
                    className={styles.sliderWrap}
                    modules={[Navigation, Mousewheel, Scrollbar]}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={3.5} // Количество миниатюр на экране
                    direction="vertical" // Вертикальная ориентация
                    watchSlidesProgress={true}
                    style={{ height: "100%" }}
                    navigation={{ prevEl: ".prevLeftBtn", nextEl: ".nextLeftBtn" }}
                    mousewheel={{
                        forceToAxis: true, // Прокрутка только по вертикали
                        sensitivity: 10, // Увеличение скорости (чем больше, тем быстрее)
                    }}
                    scrollbar={{
                        draggable: true,
                        horizontalClass: "myScroll1",
                        verticalClass: styles.myScroll,
                    }}
                >
                    {children.map((child) => (
                        <SwiperSlide className={styles.slideItem}>{child}</SwiperSlide>
                    ))}
                </Swiper>
                <div className={`${styles.nextBtn} nextLeftBtn`}>
                    <ChevronDownIcon width={20} height={20} />
                </div>
            </div>

            {/* Главный слайдер */}
            <div className={`${styles.slider} ${styles.rightSlider}`}>
                <Swiper
                    className={styles.sliderWrap}
                    modules={[
                        Thumbs, // для переключения при выборе с левого слайдера
                        Navigation,
                        Mousewheel,
                    ]}
                    thumbs={{ swiper: thumbsSwiper }}
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={{}}
                    // navigation={{ prevEl: ".prevRightBtn", nextEl: ".nextRightBtn" }}
                    loop
                    // mousewheel
                    onClick={() => setFullScreen(true)}
                >
                    {children.map((child) => (
                        <SwiperSlide className={styles.slideItem}>{child}</SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default SliderWithThumbnails;

import styles from "./EffektSliderGeneric.module.scss";
import Draggable from "react-draggable";
import { RefObject, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const EffektSliderGeneric: React.FC<{
  min: number;
  max: number;
  onChange: (val: number) => void;
  value: number;
}> = ({ min, max, onChange, value }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const scaledValue = Math.min((value - min) / (max - min), 1);

  const updateSizing = () => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    debouncedSizingUpdate();
  }, [sliderRef]);

  const debouncedSizingUpdate = useDebouncedCallback(() => updateSizing(), 100, {
    maxWait: 100,
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", debouncedSizingUpdate);
    }
  }, []);

  return (
    <div
      className={styles.calculator__input__group__percentage_slider}
      ref={sliderRef}
      data-cy="slider-container"
    >
      <div className={styles.calculator__input__group__percentage_slider__labels}>
        {Array.from(Array(6)).map((_, i) => {
          return (
            <div
              key={i}
              className={styles.calculator__input__group__percentage_slider__labels_label}
            >
              {((i / 5) * (max - min) + min).toFixed(0)}
            </div>
          );
        })}
      </div>
      <div
        className={styles.calculator__input__group__percentage_slider__track}
        data-cy="slider-track"
        onClick={(e) => {
          // If the user clicks on the slider, we want to move the handle to the clicked position
          const rect = sliderRef.current?.getBoundingClientRect();
          if (rect) {
            const x = Math.min(Math.max(0, (e.clientX || 0) - rect.left), rect.width);
            onChange((x / sliderWidth) * (max - min) + min);
          }
        }}
      >
        <div className={styles.calculator__input__group__percentage_slider__bars}>
          {Array.from(Array(10)).map((_, i) => {
            return (
              <div
                key={i}
                className={styles.calculator__input__group__percentage_slider__bars__bar}
              ></div>
            );
          })}
        </div>
        <div
          className={styles.calculator__input__group__percentage_slider__track__fill}
          style={{
            clipPath: `polygon(0 0, ${scaledValue * 100}% 0, ${scaledValue * 100}% 100%, 0 100%)`,
          }}
        >
          {Array.from(Array(10)).map((_, i) => {
            return (
              <div
                key={i}
                className={styles.calculator__input__group__percentage_slider__track__fill__bar}
              ></div>
            );
          })}
        </div>
        <Draggable
          axis="x"
          bounds="parent"
          onDrag={(e, data) => {
            onChange((data.x / sliderWidth) * (max - min) + min);
          }}
          position={{ x: scaledValue * sliderWidth, y: 0 }}
          nodeRef={handleRef as RefObject<HTMLDivElement>}
        >
          <div
            ref={handleRef}
            className={styles.calculator__input__group__percentage_slider__handle}
            data-cy="slider-handle"
          ></div>
        </Draggable>
      </div>
    </div>
  );
};

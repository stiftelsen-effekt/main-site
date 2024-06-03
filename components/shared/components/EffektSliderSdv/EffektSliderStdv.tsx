import styles from "./EffektSliderStdv.module.scss";
import Draggable from "react-draggable";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import * as Plot from "@observablehq/plot";

/**
 * A slider that returns a mean and standard deviation value
 * It has one larger handle in the middle for the mean and two smaller handles for the standard deviation
 * symmetrical around the mean
 */

export const EffektSliderStdv: React.FC<{
  min: number;
  max: number;
  onChange: (val: { mean: number; stdv: number }) => void;
  value: { mean: number; stdv: number };
}> = ({ min, max, onChange, value }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  const handleMedianRef = useRef<HTMLDivElement>(null);
  const handleStdvLeftRef = useRef<HTMLDivElement>(null);
  const handleStdvRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graphRef.current) {
      drawGraph(graphRef.current, min, max, value);
    }
  }, [graphRef, value]);

  /** Position of middle handle */
  const scaledValue = Math.min((value.mean - min) / (max - min), 1);

  /** Position of left stdv handle */
  const scaledValueLeft = Math.max((value.mean - value.stdv - min) / (max - min), 0);

  /** Position of right stdv handle */
  const scaledValueRight = Math.min((value.mean + value.stdv - min) / (max - min), 1);

  const updateSizing = () => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.getBoundingClientRect().width);
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
      <div className={styles.calculator__input__group__percentage_slider__labels_wrapper}>
        <div
          className={styles.calculator__input__group__percentage_slider__graph}
          ref={graphRef}
        ></div>

        <div className={styles.calculator__input__group__percentage_slider__labels}>
          {Array.from(Array(9)).map((_, i) => {
            return (
              <div
                key={i}
                className={styles.calculator__input__group__percentage_slider__labels_label}
              >
                {Math.round(i * (max / 8))}%
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={styles.calculator__input__group__percentage_slider__track}
        data-cy="slider-track"
        onClick={(e) => {
          // If the user clicks on the slider, we want to move the handle to the clicked position
          const rect = sliderRef.current?.getBoundingClientRect();
          if (rect) {
            const x = Math.min(Math.max(0, (e.clientX || 0) - rect.left), rect.width);
            onChange({
              mean: value.mean,
              stdv: value.stdv,
            });
          }
        }}
      >
        <div className={styles.calculator__input__group__percentage_slider__bars}>
          {Array.from(Array(8)).map((_, i) => {
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
            // clipPath: `polygon(0 0, ${scaledValueRight * 100}% 0, ${scaledValueRight * 100}% 100%, 0 100%)`,
            clipPath: `polygon(${scaledValueLeft * 100}% 0, ${scaledValueRight * 100}% 0, ${
              scaledValueRight * 100
            }% 100%, ${scaledValueLeft * 100}% 100%)`,
          }}
        >
          {Array.from(Array(8)).map((_, i) => {
            return (
              <div
                key={i}
                className={styles.calculator__input__group__percentage_slider__track__fill__bar}
              ></div>
            );
          })}
        </div>
        {/** Stdv handle left */}
        <Draggable
          axis="x"
          bounds="parent"
          onDrag={(e, data) => {
            let newStdv = Math.abs(value.mean - (data.x / sliderWidth) * (max - min));
            let newScaledLeft = (value.mean - newStdv - min) / (max - min);
            if (newScaledLeft < 0) {
              return;
            }
            onChange({
              mean: value.mean,
              stdv: newStdv,
            });
          }}
          position={{ x: scaledValueLeft * sliderWidth, y: 0 }}
          nodeRef={handleStdvLeftRef}
        >
          <div
            className={
              styles.calculator__input__group__percentage_slider__handle__stdv +
              " " +
              styles.calculator__input__group__percentage_slider__handle__stdv_left
            }
            data-cy="slider-handle"
            ref={handleStdvLeftRef}
          ></div>
        </Draggable>
        {/** Mean handle */}
        <Draggable
          axis="x"
          bounds="parent"
          onDrag={(e, data) => {
            onChange({
              mean: (data.x / sliderWidth) * (min + (max - min)),
              stdv: value.stdv,
            });
          }}
          position={{ x: scaledValue * sliderWidth, y: 0 }}
          nodeRef={handleMedianRef}
        >
          <div
            className={styles.calculator__input__group__percentage_slider__handle}
            data-cy="slider-handle-stdvleft"
            ref={handleMedianRef}
          ></div>
        </Draggable>
        {/** Stdv handle right */}
        <Draggable
          axis="x"
          bounds="parent"
          onDrag={(e, data) => {
            let newStdv = Math.abs(value.mean - (data.x / sliderWidth) * (max - min));
            let newScaledRight = (value.mean + newStdv - min) / (max - min);
            if (newScaledRight > 1) {
              return;
            }
            onChange({
              mean: value.mean,
              stdv: newStdv,
            });
          }}
          position={{ x: scaledValueRight * sliderWidth, y: 0 }}
          nodeRef={handleStdvRightRef}
        >
          <div
            className={
              styles.calculator__input__group__percentage_slider__handle__stdv +
              " " +
              styles.calculator__input__group__percentage_slider__handle__stdv_right
            }
            data-cy="slider-handle-stdvright"
            ref={handleStdvRightRef}
          ></div>
        </Draggable>
      </div>
      {/** 
      <div>
        <div className={styles.calculator__input__group__percentage_slider__outputs}>
          <div className={styles.calculator__input__group__percentage_slider__outputs_output}>
            μ = {value.mean.toFixed(2)}
          </div>
          <div className={styles.calculator__input__group__percentage_slider__outputs_output}>
            σ = {value.stdv.toFixed(2)}
          </div>
        </div>
      </div>
      */}
    </div>
  );
};

const drawGraph = async (
  ref: HTMLDivElement,
  min: number,
  max: number,
  discountRate: { mean: number; stdv: number },
) => {
  const { pdf } = await import("@stdlib/stats-base-dists-truncated-normal");

  const data = Array.from(Array(101)).map((_, i) => {
    const pct = i * 0.08;
    return { x: pct, y: pdf(pct, min, max, discountRate.mean, discountRate.stdv) };
  });

  const plot = Plot.plot({
    margin: 0,
    inset: 0,
    padding: 0,
    height: ref.clientHeight,
    width: ref.clientWidth,
    style: "background: transparent;",
    y: {
      ticks: 0,
      label: null,
    },
    x: {
      ticks: 0,
      label: null,
      domain: [min, max],
    },
    marks: [Plot.areaY(data, { x: "x", y: "y", curve: "natural" })],
  });

  ref.innerHTML = "";
  ref.appendChild(plot);
};

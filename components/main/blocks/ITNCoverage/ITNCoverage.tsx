import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";

import styles from "./ITNCoverage.module.scss";
import { useState } from "react";
import { EffektSliderGeneric } from "../../../shared/components/EffektSliderGeneric/EffektSliderGeneric";
import { PortableText } from "@portabletext/react";
import { ITNCoverageGraph } from "./ITNCoverageGraph";

export const ITNCoverage: React.FC<{
  title: string;
  subtitle: string;
  images: SanityImageObject[];
  range: [number, number];
  mapExplenation?: string;
  graphExplenation?: string;
  caption?: any[];
}> = ({ title, subtitle, images, range, mapExplenation, graphExplenation, caption }) => {
  const [start, end] = range;

  const [sliderValue, setSliderValue] = useState(start + 2);
  const [showing, setShowing] = useState<"graph" | "map">("map");

  if (images.length !== end - start + 1) {
    return <div>Missing images for ITN coverage</div>;
  }

  const current = Math.floor((sliderValue - start) % images.length);
  const next = current + 1;

  const currentOpacity = 1 - (sliderValue % 1);
  const nextOpacity = 1;

  return (
    <div className={styles.wrapper}>
      <p className="inngress">{title}</p>
      <span className={styles.subtitle}>{subtitle}</span>
      <EffektSliderGeneric
        min={start}
        max={end}
        value={sliderValue}
        onChange={(val) => setSliderValue(val)}
      />

      <div className={styles.content}>
        <div
          className={styles.imageWrapper}
          style={{
            opacity: showing === "map" ? 1 : 0,
            transform: showing === "map" ? "translateX(0)" : "translateX(-1rem)",
          }}
        >
          {images.map((image, i) => (
            <div
              className={styles.image}
              key={i}
              style={{
                opacity: i === current ? currentOpacity : i === next ? nextOpacity : 0,
                zIndex: i === current ? 1 : 0,
              }}
            >
              <ResponsiveImage image={image} key={i} layout="fill" />
            </div>
          ))}
          <i className={styles.explenation}>{mapExplenation}</i>
        </div>
        <div
          className={styles.graphWrapper}
          style={{
            opacity: showing === "graph" ? 1 : 0,
            transform: showing === "graph" ? "translateX(0)" : "translateX(1rem)",
          }}
        >
          <ITNCoverageGraph year={sliderValue}></ITNCoverageGraph>
          <i className={styles.explenation}>{graphExplenation}</i>
        </div>
        <div className={styles.buttons}>
          {showing === "graph" ? (
            <button onClick={() => setShowing("map")}>← Se kart</button>
          ) : (
            <button onClick={() => setShowing("graph")}>Se graf →</button>
          )}
        </div>
      </div>
      <span className="caption">
        <PortableText value={caption}></PortableText>
      </span>
    </div>
  );
};

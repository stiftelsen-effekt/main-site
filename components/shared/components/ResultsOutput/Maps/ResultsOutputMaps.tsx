import { useEffect, useMemo, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import { AfricaMap } from "../../AfricaMap/AfricaMap";
import { AsiaMap } from "../../AsiaMap/AsiaMap";
import styles from "./ResultsOutputMaps.module.scss";
import { stegaClean } from "@sanity/client/stega";

export const ResultsOutputMaps: React.FC<{ outputCountries: string[]; locale?: string }> = ({
  outputCountries,
  locale,
}) => {
  const [activeMap, setActiveMap] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const maps = useMemo(() => {
    const maps: { name: string; component: any }[] = [];
    if (outputCountries) {
      for (const country of outputCountries.map(stegaClean)) {
        if (AsiaSet.has(country)) {
          if (maps.some((m) => stegaClean(m.name) === "Asia")) continue;
          maps.push({
            name: "Asia",
            component: (
              <AsiaMap
                highlightedCountries={outputCountries.filter((c) => AsiaSet.has(stegaClean(c)))}
                setHoveredCountry={setHoveredCountry}
                locale={locale}
              ></AsiaMap>
            ),
          });
        } else if (AfricaSet.has(country)) {
          if (maps.some((m) => stegaClean(m.name) === "Afrika")) continue;
          maps.push({
            name: "Afrika",
            component: (
              <AfricaMap
                highlightedCountries={outputCountries.filter((c) => AfricaSet.has(stegaClean(c)))}
                setHoveredCountry={setHoveredCountry}
                locale={locale}
              ></AfricaMap>
            ),
          });
        }
      }
    }
    return maps;
  }, [outputCountries, locale]);

  useEffect(() => {
    if (mapWrapperRef.current) {
      setMapHeight(mapWrapperRef.current.querySelector(`.${styles.activeMap}`)?.clientHeight || 0);
    }
  }, [activeMap]);

  return (
    <div className={styles.mapWrapper} ref={mapWrapperRef}>
      {hoveredCountry && (
        <div
          className={styles.hoveredCountry}
          style={{ left: hoveredCountry.x, top: hoveredCountry.y }}
        >
          {hoveredCountry.name}
        </div>
      )}
      <AnimateHeight height={mapHeight || "auto"} animateOpacity>
        <div className={styles.mapsContainer}>
          {activeMap !== maps.length - 1 && (
            <button className={styles.nextMap} onClick={() => setActiveMap(activeMap + 1)}>
              {maps[activeMap + 1].name} →
            </button>
          )}
          {activeMap !== 0 && (
            <button className={styles.prevMap} onClick={() => setActiveMap(activeMap - 1)}>
              ← {maps[activeMap - 1].name}
            </button>
          )}
          <div className={styles.mapsTrack}>
            {maps.map((map, i) => (
              <div
                key={map.name}
                className={styles.map + " " + (activeMap === i ? styles.activeMap : "")}
              >
                {map.component}
              </div>
            ))}
          </div>
        </div>
      </AnimateHeight>
    </div>
  );
};

const AsiaSet = new Set([
  "af",
  "am",
  "az",
  "bh",
  "bd",
  "bt",
  "bn",
  "kh",
  "cn",
  "cy",
  "ge",
  "in",
  "id",
  "ir",
  "iq",
  "il",
  "jp",
  "jo",
  "kz",
  "kp",
  "kr",
  "kw",
  "kg",
  "la",
  "lb",
  "my",
  "mv",
  "mn",
  "mm",
  "np",
  "om",
  "pk",
  "ps",
  "ph",
  "qa",
  "sa",
  "sg",
  "lk",
  "sy",
  "tw",
  "tj",
  "th",
  "tl",
  "tr",
  "tm",
  "ae",
  "uz",
  "vn",
  "ye",
]);
const AfricaSet = new Set([
  "dz",
  "ao",
  "bj",
  "bw",
  "bf",
  "bi",
  "cv",
  "cm",
  "cf",
  "td",
  "km",
  "cd",
  "cg",
  "ci",
  "dj",
  "eg",
  "gq",
  "er",
  "sz",
  "et",
  "ga",
  "gm",
  "gh",
  "gn",
  "gw",
  "ke",
  "ls",
  "lr",
  "ly",
  "mg",
  "mw",
  "ml",
  "mr",
  "mu",
  "yt",
  "ma",
  "mz",
  "na",
  "ne",
  "ng",
  "re",
  "rw",
  "sh",
  "st",
  "sn",
  "sc",
  "sl",
  "so",
  "za",
  "ss",
  "sd",
  "tz",
  "tg",
  "tn",
  "ug",
  "eh",
  "zm",
  "zw",
]);

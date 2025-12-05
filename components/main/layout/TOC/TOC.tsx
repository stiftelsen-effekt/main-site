import { CSSProperties, useEffect, useState, useMemo } from "react";
import styles from "./TOC.module.scss";

// Function to get 1rem value from the browser and memoize it
const useRemValue = () => {
  return useMemo(() => {
    if (typeof window === "undefined") return 16;
    const rootFontSize = getComputedStyle(document.documentElement).fontSize;
    return parseFloat(rootFontSize);
  }, []);
};

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
};

const useElementPositions = () => {
  const [positions, setPositions] = useState<{
    articleStart: number;
    articleEnd: number;
    headerPositions: Record<string, number>;
  }>({
    articleStart: 0,
    articleEnd: 0,
    headerPositions: {},
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tocBoundaries = document.querySelectorAll("[data-toc-id]");
    const elements = Array.from(tocBoundaries);
    const boundaryPositions = elements.map(
      (el, i) =>
        (i === 0 ? el.getBoundingClientRect().bottom : el.getBoundingClientRect().top) +
        window.scrollY,
    );

    const tocHeaders = document.querySelectorAll("[data-toc-key]");
    const headers = Array.from(tocHeaders);
    const headerPositions = headers.reduce((acc, el) => {
      const key = el.getAttribute("data-toc-key");
      const top = el.getBoundingClientRect().top + window.scrollY;
      return { ...acc, [key as string]: top };
    }, {});

    setPositions({
      articleStart: boundaryPositions[0],
      articleEnd: boundaryPositions[1],
      headerPositions,
    });
  }, []);

  return positions;
};

export const TOC: React.FC<{ items: { title: string; _key: string }[] }> = ({ items }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const remValue = useRemValue();
  const scrollPosition = useScrollPosition();
  const { articleStart, articleEnd, headerPositions } = useElementPositions();

  const scrollIndicatorHeight = useMemo(() => remValue * 10, [remValue]);
  const margin = useMemo(() => remValue, [remValue]);

  const scrollbarTranslate = useMemo(() => {
    if (!isClient) return 0;

    const scrollableHeight = articleEnd - articleStart - window.innerHeight + 2 * margin;
    const scrollbarPosition = (scrollPosition - articleStart + margin) / scrollableHeight;
    const maxTranslateValue = window.innerHeight - scrollIndicatorHeight - 2 * margin;
    return Math.min(Math.max(scrollbarPosition * maxTranslateValue, 0), maxTranslateValue);
  }, [isClient, scrollPosition, articleStart, articleEnd, margin, scrollIndicatorHeight]);

  const clientStyles = useMemo<CSSProperties>(() => {
    if (!isClient) return { position: "absolute", top: "1rem" };

    const position =
      scrollPosition < articleStart
        ? "absolute"
        : scrollPosition > articleEnd - window.innerHeight
        ? "absolute"
        : "fixed";
    const top =
      scrollPosition < articleStart
        ? `calc(${articleStart}px + ${margin}px)`
        : scrollPosition > articleEnd - window.innerHeight
        ? `calc(${articleEnd}px - ${window.innerHeight}px + ${margin}px)`
        : `${margin}px`;
    return { position, top };
  }, [isClient, scrollPosition, articleStart, articleEnd, margin]);

  if (!isClient) {
    // Render a placeholder for SSR
    return <div className={styles.toc}></div>;
  }

  return (
    <div className={styles.toc} style={clientStyles}>
      <div
        className={styles.scrollIndicator}
        style={{
          transform: `translateY(${scrollbarTranslate}px) translateX(-2px)`,
          height: `${scrollIndicatorHeight}px`,
        }}
      ></div>
      <ul>
        {items.map((item) => (
          <li
            key={item._key}
            style={{
              top:
                Math.max(
                  ((headerPositions[item._key] - articleStart) / (articleEnd - articleStart)) * 100,
                  0,
                ) + "%",
            }}
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({
                  top: headerPositions[item._key] - 200,
                  behavior: "smooth",
                });
              }
            }}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

import { config } from "cypress/types/bluebird";
import styles from "./BlockTable.module.scss";
import { CSSProperties, HTMLAttributes, useEffect, useRef, useState } from "react";

type BlockTableConfig = {
  title?: string;
  subtitle?: string;
  caption?: string;
  headers?: boolean;
  lastrow_seperator?: boolean;
  widthtype?: "column" | "full" | "fixed";
  fixedwidth?: number;
};

type BlockTableContents = {
  rows: {
    _key: string;
    _type: string;
    cells: string[];
  }[];
};

export const BlockTable: React.FC<{ config: BlockTableConfig; table: BlockTableContents }> = ({
  config,
  table,
}) => {
  const { rows } = table;

  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const [scrollButtonDisplayed, setScrollButtonDisplayed] = useState(true);
  const contentsRef = useRef<HTMLDivElement>(null);

  /** A check to see if there is horizontal scroll in the table contents container */
  const checkForScroll = () => {
    if (contentsRef.current) {
      if (contentsRef.current.scrollWidth > contentsRef.current.clientWidth) {
        setHasScroll(true);
      } else {
        setHasScroll(false);
      }
    }
  };

  // Check for scroll on mount
  useEffect(() => {
    checkForScroll();
  }, []);

  // Check for scroll on resize
  useEffect(() => {
    if (!contentsRef.current) return;
    window.addEventListener("resize", checkForScroll);
    contentsRef.current.addEventListener("scroll", () => {
      if (contentsRef.current) {
        setHasScrolled(true);
        contentsRef.current.removeEventListener("scroll", () => {});
      }
    });
    return () => window.removeEventListener("resize", checkForScroll);
  }, [contentsRef]);

  useEffect(() => {
    if (hasScrolled) {
      var timeoutId = setTimeout(() => {
        setScrollButtonDisplayed(false);
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, [hasScrolled]);

  const classes = [styles.blockTable];
  if (config.widthtype === "column") {
    classes.push(styles.column);
  } else if (config.widthtype === "full") {
    classes.push(styles.full);
  } else if (config.widthtype === "fixed") {
    classes.push(styles.fixed);
  }

  const outerContentsClasses = [styles.outerContents];
  if (hasScroll) {
    outerContentsClasses.push(styles.hasScroll);
  }
  if (hasScrolled) {
    outerContentsClasses.push(styles.hasScrolled);
  }

  if (config.title) {
    classes.push(styles.hasTitle);
  }

  const setStyles: CSSProperties = {};
  if (config.widthtype === "fixed") {
    setStyles["width"] = `${config.fixedwidth}rem`;
  }

  return (
    <div className={classes.join(" ")}>
      {config.title && (
        <div className={styles.titles}>
          <h4>{config.title}</h4>
          <span>{config.subtitle}</span>
        </div>
      )}
      <div className={outerContentsClasses.join(" ")}>
        <div className={styles.contents} ref={contentsRef}>
          <table style={setStyles} cellSpacing={0}>
            {rows.map((row, index) => {
              if (index === 0 && config.headers) {
                return (
                  <thead key={row._key}>
                    <tr>
                      {row.cells.map((cell, index) => (
                        <th key={index}>{cell}</th>
                      ))}
                    </tr>
                  </thead>
                );
              } else if (index === rows.length - 1 && config.lastrow_seperator) {
                return (
                  <tbody key={row._key} className={styles.lastRow}>
                    <tr>
                      {row.cells.map((cell, index) => (
                        <td key={index}>{cell}</td>
                      ))}
                    </tr>
                  </tbody>
                );
              } else if (index === rows.length - 2 && config.lastrow_seperator) {
                return (
                  <tbody key={row._key} className={styles.secondLastRow}>
                    <tr>
                      {row.cells.map((cell, index) => (
                        <td key={index}>{cell}</td>
                      ))}
                    </tr>
                  </tbody>
                );
              } else {
                return (
                  <tbody key={row._key}>
                    <tr>
                      {row.cells.map((cell, index) => (
                        <td key={index}>{cell}</td>
                      ))}
                    </tr>
                  </tbody>
                );
              }
            })}
          </table>
        </div>
        <p className={styles.caption}>{config.caption}</p>
        {scrollButtonDisplayed && (
          <div
            className={styles.scrollRightButton}
            onClick={() =>
              contentsRef.current?.scrollBy({ left: Number.MAX_SAFE_INTEGER, behavior: "smooth" })
            }
          >
            {/* Arrow right UTF8 */}
            <span>&#10132;</span>
          </div>
        )}
      </div>
    </div>
  );
};

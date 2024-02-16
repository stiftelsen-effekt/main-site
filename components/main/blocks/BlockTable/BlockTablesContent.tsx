import { CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./BlockTablesContent.module.scss";

export type TableConfiguration = {
  headers?: boolean;
  lastrow_seperator?: boolean;
};

export type BlockTableContents = {
  rows: {
    _key: string;
    _type: string;
    cells: string[];
  }[];
};

export const BlockTablesContent: React.FC<{
  config?: TableConfiguration;
  contents: BlockTableContents;
  fixedStyles: CSSProperties;
  fixedWidths?: number[];
}> = ({ config, contents, fixedStyles, fixedWidths }) => {
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

  if (!contents) return null;
  const { rows } = contents;

  const outerContentsClasses = [styles.outerContents];
  if (hasScroll) {
    outerContentsClasses.push(styles.hasScroll);
  }
  if (hasScrolled) {
    outerContentsClasses.push(styles.hasScrolled);
  }

  return (
    <div className={outerContentsClasses.join(" ")}>
      <div className={styles.contents} ref={contentsRef}>
        <table style={fixedStyles} cellSpacing={0}>
          {rows.map((row, index) => {
            if (index === 0 && config && config.headers) {
              return (
                <thead key={row._key}>
                  <tr>
                    {row.cells.map((cell, index) => (
                      <th key={index} style={getCellStyle(index, fixedWidths)}>
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              );
            } else {
              const classes = [];
              if (config && config.lastrow_seperator && index === rows.length - 1) {
                classes.push(styles.lastRow);
              } else if (config && config.lastrow_seperator && index === rows.length - 2) {
                classes.push(styles.secondLastRow);
              }
              return (
                <tbody key={row._key} className={classes.join(" ")}>
                  <tr>
                    {row.cells.map((cell, index) => (
                      <td key={index} style={getCellStyle(index, fixedWidths)}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                </tbody>
              );
            }
          })}
        </table>
      </div>
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
  );
};

const getCellStyle = (index: number, fixedWidths?: number[]): CSSProperties => {
  return {
    width: fixedWidths && fixedWidths[index] ? `${fixedWidths[index]}rem` : "auto",
  };
};

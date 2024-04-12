import styles from "./BlockTables.module.scss";
import { CSSProperties, HTMLAttributes, useEffect, useRef, useState } from "react";
import { BlockTableContents, BlockTablesContent, TableConfiguration } from "./BlockTablesContent";

type BlockTableConfig = {
  title?: string;
  subtitle?: string;
  containertype?: "column" | "full" | "fixed";
  fixedwidth?: number;
};

type BlockTablesTable = {
  configuration: TableConfiguration;
  contents: BlockTableContents;
};

export const BlockTables: React.FC<{
  config: BlockTableConfig;
  tables: BlockTablesTable[];
  columnWidths?: number[];
}> = ({ config, tables, columnWidths }) => {
  const classes = [styles.blockTable];
  if (config.containertype === "column") {
    classes.push(styles.column);
  } else if (config.containertype === "full") {
    classes.push(styles.full);
  } else if (config.containertype === "fixed") {
    classes.push(styles.fixed);
  }

  if (config.title) {
    classes.push(styles.hasTitle);
  }

  const setStyles: CSSProperties = {};
  if (config.containertype === "fixed") {
    setStyles["width"] = `${config.fixedwidth}rem`;
  }

  return (
    <div className={classes.join(" ")} style={setStyles}>
      {config.title && (
        <div className={styles.titles}>
          <h5>{config.title}</h5>
          <span>{config.subtitle}</span>
        </div>
      )}
      <div className={styles.contentsWrapper}>
        {tables &&
          tables.map((table, index) => (
            <BlockTablesContent
              key={index}
              config={table.configuration}
              contents={table.contents}
              fixedStyles={setStyles}
              fixedWidths={columnWidths}
            />
          ))}
      </div>
    </div>
  );
};

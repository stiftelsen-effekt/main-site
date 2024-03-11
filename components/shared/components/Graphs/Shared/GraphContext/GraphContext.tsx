import { useState } from "react";
import {
  BlockTableContents,
  BlockTablesContent,
} from "../../../../../main/blocks/BlockTable/BlockTablesContent";
import AnimateHeight from "react-animate-height";
import { PortableText } from "@portabletext/react";
import styles from "./GraphContext.module.scss";
import { EffektButton } from "../../../EffektButton/EffektButton";
import { Download } from "react-feather";

export type GraphContextData = {
  description: string;
  detailed_description_label: string;
  detailed_description: any[];
  allow_table: boolean;
  table_label: string;
  table_close_label: string;
};

export const GraphContext: React.FC<{
  context: GraphContextData;
  tableContents: BlockTableContents;
}> = ({ context, tableContents }) => {
  const [explenationOpen, setExplenationOpen] = useState(false);
  const [tableDisplayed, setTableDisplayed] = useState(false);

  return (
    <div className={styles.wrapper}>
      <i>{context.description}</i>
      <button
        onClick={(e) => {
          setExplenationOpen(!explenationOpen);
          e.currentTarget.blur();
        }}
        className={styles.detailedDescriptionLabel}
      >
        {context.detailed_description_label}{" "}
        <span
          style={{
            display: "inline-block",
            transition: "all 200ms",
            transform: `rotate(${explenationOpen ? "180deg" : "0deg"})`,
          }}
        >
          ↓
        </span>
      </button>
      <AnimateHeight height={explenationOpen ? "auto" : 0}>
        <PortableText value={context.detailed_description} />
      </AnimateHeight>
      {context.allow_table && (
        <>
          <div className={styles.actions}>
            <button
              onClick={(e) => {
                setTableDisplayed(!tableDisplayed);
                e.currentTarget.blur();
              }}
              className={styles.tableButton}
            >
              {tableDisplayed ? context.table_close_label : context.table_label}
            </button>
            {tableDisplayed && (
              <EffektButton
                onClick={() => {
                  const csv = tableContents.rows
                    .map((row) =>
                      row.cells
                        .map((c) => {
                          // If cell is a number, return it as is
                          if (!isNaN(Number(c))) return c;
                          // Escape double quotes by doubling them
                          return `"${c.replace(/"/g, '""')}"`;
                        })
                        .join(","),
                    )
                    .join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "data.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Last ned CSV&nbsp;&nbsp;
                <Download size={"0.8rem"} />
              </EffektButton>
            )}
          </div>
          {tableDisplayed && (
            <BlockTablesContent
              fixedStyles={{}}
              config={{ headers: true }}
              contents={tableContents}
            />
          )}
        </>
      )}
    </div>
  );
};

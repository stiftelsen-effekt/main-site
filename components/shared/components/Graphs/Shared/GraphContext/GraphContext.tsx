/**
 *     {
      type: "string",
      name: "description",
      title: "Description",
      description: "A short description of the graph with main source if applicable"
    },
    {
      type: "string",
      name: "detailed_description_label",
      title: "Detailed description label",
      description: "The label for the detailed description expander"
    },
    {
      type: "array",
      name: "detailed_description",
      title: "Detailed description",
      of: [{ type: "block" }],
    },
    {
      type: "boolean",
      name: "allow_table",
      title: "Allow table view of data",
    },
    {
      type: "string",
      name: "table_label",
      title: "Table label",
      description: "The label for the table expander"
    },
    {
      type: "string",
      name: "table_close_label",
      title: "Table close label",
      description: "The label for the table close label"
    }
 */

import { useState } from "react";
import {
  BlockTableContents,
  BlockTablesContent,
} from "../../../../../main/blocks/BlockTable/BlockTablesContent";
import AnimateHeight from "react-animate-height";
import { PortableText } from "@portabletext/react";

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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "2rem" }}>
      <i>{context.description}</i>
      <span
        onClick={(e) => {
          setExplenationOpen(!explenationOpen);
        }}
        style={{ cursor: "pointer", marginTop: "0.25rem" }}
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
      </span>
      <AnimateHeight height={explenationOpen ? "auto" : 0}>
        <PortableText value={context.detailed_description} />
      </AnimateHeight>
      {context.allow_table && (
        <>
          <span
            onClick={(e) => {
              setTableDisplayed(!tableDisplayed);
            }}
            style={{ cursor: "pointer", textDecoration: "underline", marginBottom: "1rem" }}
          >
            {tableDisplayed ? context.table_close_label : context.table_label}
          </span>
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

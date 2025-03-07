import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { Minus, Plus } from "react-feather";
import { Links, LinkType } from "../../../main/blocks/Links/Links";
import { NavLink } from "../Navbar/Navbar";
import elements from "./Expander.module.scss";

export type ExpanderProps = {
  title: string;
  content: string;
  linksTitle: string;
  links: (NavLink | LinkType)[];
};

export const Expander: React.FC<ExpanderProps> = ({ title, linksTitle, content, links }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`${elements.expanderWrapper} ${
        expanded ? elements.expanderWrapperOpen : undefined
      }`}
    >
      <label className={elements.expanderHeader}>
        <button
          className="sr-only"
          onClick={(e) => {
            e.currentTarget.blur();
            setExpanded(!expanded);
          }}
        ></button>
        <p className="inngress">{title}</p>
        {expanded ? <Minus size={28} /> : <Plus size={28} />}
      </label>
      <div className={elements.expanderContent}>
        <AnimateHeight height={expanded ? "auto" : 0} animateOpacity>
          <p>{content}</p>
          {links ? (
            <>
              <p className="inngress">{linksTitle}</p>
              <Links links={links} />
            </>
          ) : null}
        </AnimateHeight>
      </div>
    </div>
  );
};

import Link from "next/link";
import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { Minus, Plus } from "react-feather";
import elements from "../../styles/Elements.module.css";
import { Links } from "./links";

export type ExpanderProps = {
  title: string,
  content: string,
  links: { _key: string, title: string, url: string }[]
}

export const Expander: React.FC<ExpanderProps> = ({ title, content, links }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`${elements.expanderWrapper} ${expanded ? elements.expanderWrapperOpen : undefined}`}>
      <label className={elements.expanderHeader} >
        <button className="sr-only" onClick={() => setExpanded(!expanded)}></button>
        <h2>{title}</h2>
        {expanded ? <Minus size={28}/> : <Plus size={28} />}
      </label>
      <div className={elements.expanderContent}>
        <AnimateHeight height={expanded ? 'auto' : '0%'} animateOpacity>
          <p>
            {content}
          </p>
          {
            links ? 
            <>
              <h2>Les mer:</h2>
              <Links links={links} />
            </> : null
          }
          
        </AnimateHeight>
      </div>
    </div>
  )
}
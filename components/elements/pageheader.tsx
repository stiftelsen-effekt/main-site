import React from "react";
import style from "../../styles/Elements.module.css"
import { Links } from "./links";

export const PageHeader: React.FC<{ title: string, inngress?: string, links?: { _key: string, title: string, url: string }[] }> = ({ title, inngress, links }) => {
  const hasmetacontent = inngress || links
  
  return (<section className={`${style.pageheader} ${hasmetacontent ? style.pageheadermeta : null}`}>
    <div>
      <h1>{title}</h1>
    </div>
    {
      hasmetacontent ?
      <div>
        {inngress ? <p>{inngress}</p> : null}
        {links ? <Links links={links} /> : null}
      </div> :
      null
    }
  </section>)
}
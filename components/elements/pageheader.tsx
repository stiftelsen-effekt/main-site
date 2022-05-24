import React from "react";
import style from "../../styles/Elements.module.css"

export const PageHeader: React.FC<{ title: string, inngress?: string, links?: { title: string, url: string }[] }> = ({ title, inngress, links }) => {
  return (<section className={style.pageheader}>
    <div>
      <h1>{title}</h1>
    </div>
    <div></div>
  </section>)
}
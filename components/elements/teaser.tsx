import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import elements from "../../styles/Elements.module.css";
import { EffektButton } from "./effektbutton";

export const Teaser: React.FC<{ title: string, paragraph: string, link: string, imageurl: string }> = ({ title, paragraph, link, imageurl }) => {
  const router = useRouter()
  
  return (
    <div className={elements.teaser}>
      <div className={elements.teaserimage}>
        <Image src={imageurl} alt={title} width={300} height={300} />
      </div>
      <div className={elements.teasertext}>
        <div>
          <h2>{title}</h2>
          <p>{paragraph}</p>
        </div>
        <EffektButton onClick={() => {
          router.push(link)
        }}>Les mer</EffektButton>
      </div>
    </div>
  )
}
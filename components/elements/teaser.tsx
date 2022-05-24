import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import elements from "../../styles/Elements.module.css";
import { EffektButton } from "./effektbutton";
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { ResponsiveImage } from "./responsiveimage";

export interface Teaser { 
  title: string, 
  paragraph: string, 
  link: string, 
  image: SanityImageSource
}
export const Teaser: React.FC<Teaser> = ({ title, paragraph, link, image }) => {
  const router = useRouter()
  
  return (
    <div className={elements.teaser}>
      <div className={elements.teaserimage}>
        <ResponsiveImage image={image} />
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
import style from "./GiveWellStamp.module.scss";
import Stamp from "./Stamp.png";
import GiveWellLogo from "./GiveWellLogo.png";
import Image from "next/image";
import { LinkType, Links } from "../Links/Links";

export type GiveWellStampProps = {
  links: LinkType[];
  quote: string;
  quotee: string;
  quoteePosition: string;
};

export const GiveWellStamp: React.FC<GiveWellStampProps> = ({
  links,
  quote,
  quotee,
  quoteePosition,
}) => {
  return (
    <div className={style.container}>
      <div className={style.context}>
        <Links links={links}></Links>
        <div className={style.stamp}>
          <Image src={Stamp} layout={"fill"} objectFit={"contain"} objectPosition={"left"} alt="" />
        </div>
      </div>
      <div className={style.quote}>
        <div className={style.quoteText}>
          <div className={style.logo}>
            <Image
              src={GiveWellLogo}
              layout={"fill"}
              objectFit={"contain"}
              objectPosition={"left"}
              alt="GiveWell"
            />
          </div>
          <p className="inngress">“{quote}”</p>
          <span className={style.quoteAuthor}>{quotee}</span>
          <span className={style.quotePosition}>{quoteePosition}</span>
        </div>
      </div>
    </div>
  );
};

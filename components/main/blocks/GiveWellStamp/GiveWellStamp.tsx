import style from "./GiveWellStamp.module.scss";
import Stamp from "./Stamp.png";
import GiveWellLogo from "./GiveWellLogo.png";
import Image from "next/image";
import { Links } from "../Links/Links";

export const GiveWellStamp: React.FC = () => {
  return (
    <div className={style.container}>
      <div className={style.context}>
        <div className={style.stamp}>
          <Image src={Stamp} layout={"fill"} objectFit={"contain"} objectPosition={"left"} />
        </div>
        <Links
          links={[
            {
              _type: "link",
              _key: "topplista",
              title: "Topplista",
              url: "https://giffektivt.no/organizations",
              newtab: true,
            },
            {
              _type: "link",
              _key: "givewell",
              title: "GiveWell",
              url: "https://givewell.org",
              newtab: true,
            },
          ]}
        ></Links>
      </div>
      <div className={style.quote}>
        <div className={style.quoteText}>
          <div className={style.logo}>
            <Image
              src={GiveWellLogo}
              layout={"fill"}
              objectFit={"contain"}
              objectPosition={"left"}
            />
          </div>

          <p className="inngress">
            “We're very grateful that Gi Effektivt is helping donors in Norway support GiveWell
            charities! Donations through Gi Effektivt will save and significantly improve the lives
            of people living in the poorest parts of the world.”
          </p>
          <span className={style.quoteAuthor}>Stephanie Stojanic</span>
          <span className={style.quotePosition}>GiveWell Director of Development</span>
        </div>
      </div>
    </div>
  );
};

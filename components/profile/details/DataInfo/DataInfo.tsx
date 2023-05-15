import Link from "next/link";
import { PortableText } from "../../../../lib/sanity";
import style from "./DataInfo.module.scss";

export const DataInfo: React.FC<{ page: any }> = ({ page }) => {
  return (
    <section className={style.columnswrapper}>
      <h5>Om dine data</h5>
      <div className={style.columns}>
        <section className={style.tax}>
          <strong>Skattefradrag</strong>
          <PortableText blocks={page.tax} />

          <Link href="/skattefradrag" passHref>
            <a target={"_blank"}>Les mer →</a>
          </Link>
        </section>
        <section className={style.privacy}>
          <strong>Personvern</strong>
          <PortableText blocks={page.data} />

          <Link href="/personvern" passHref>
            <a target={"_blank"}>Les mer →</a>
          </Link>
        </section>
      </div>
    </section>
  );
};

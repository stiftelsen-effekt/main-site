import Link from "next/link";
import { PortableText } from "../../lib/sanity";
import style from "../../styles/Profile.module.css";

export const DataInfo: React.FC<{ data: any }> = ({ data }) => {
  return (
    <section className={style.columnswrapper}>
      <h5>Om dine data</h5>
      <div className={style.columns}>
        <section className={style.tax}>
          <strong>Skattefradrag</strong>
          <PortableText blocks={data[0].tax[0]} />

          <Link href="/skattefradrag" passHref>
            <a target={"_blank"}>Les mer →</a>
          </Link>
        </section>
        <section className={style.privacy}>
          <strong>Personvern</strong>
          <PortableText blocks={data[0].data[0]} />

          <Link href="/personvern" passHref>
            <a target={"_blank"}>Les mer →</a>
          </Link>
        </section>
      </div>
    </section>
  );
};

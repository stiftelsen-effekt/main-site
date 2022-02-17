import { groq } from "next-sanity";
import { useRouter } from "next/router";
import { PortableText } from "../../lib/sanity";
import { getClient } from "../../lib/sanity.server";
import style from "../../styles/Profile.module.css";

export const DataInfo: React.FC<{ data: any }> = ({ data }) => {
  return (
    <section className={style.dataGrid}>
      <section className={style.dataHeader}>
        <hr />
        <h2>Om dine data</h2>
      </section>
      <section className={style.tax}>
        <h3>Skattefradrag</h3>
        <PortableText blocks={data[0].tax[0]} />
      </section>
      <section className={style.privacy}>
        <h3>Personvern</h3>
        <PortableText blocks={data[0].data[0]} />
      </section>
    </section>
  );
};


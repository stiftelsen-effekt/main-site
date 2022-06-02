import { PortableText } from "../../lib/sanity";
import style from "../../styles/Profile.module.css";

export const DataInfo: React.FC<{ data: any }> = ({ data }) => {
  return (
    <section className={style.dataGrid}>
      <section className={style.dataHeader}>
        <h2>Om dine data</h2>
      </section>
      <section className={style.tax}>
        <strong>Skattefradrag</strong>
        <PortableText blocks={data[0].tax[0]} />
      </section>
      <section className={style.privacy}>
        <strong>Personvern</strong>
        <PortableText blocks={data[0].data[0]} />
      </section>
    </section>
  );
};

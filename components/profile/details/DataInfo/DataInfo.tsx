import Link from "next/link";
import style from "./DataInfo.module.scss";
import { PortableText } from "@portabletext/react";
import { ProfilePageInfoConfiguration } from "../ProfileInfo/ProfileInfo";
import { ProfilePage } from "../../../../pages/dashboard/ProfilePage";

export const DataInfo: React.FC<{ page: ProfilePage }> = ({ page }) => {
  return (
    <section className={style.columnswrapper}>
      <h5>{page.info_title}</h5>
      <div className={style.columns}>
        <section className={style.tax}>
          <strong>{page.tax_subtitle}</strong>
          <PortableText value={page.tax} />

          <Link href={page.tax_link ?? "/"} passHref target={"_blank"}>
            {page.read_more_label}→
          </Link>
        </section>
        <section className={style.privacy}>
          <strong>{page.data_subtitle}</strong>
          <PortableText value={page.data} />

          <Link href={page.data_link ?? "/"} passHref target={"_blank"}>
            {page.read_more_label}→
          </Link>
        </section>
      </div>
    </section>
  );
};

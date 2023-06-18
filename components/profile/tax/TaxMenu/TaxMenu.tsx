import React from "react";
import style from "./TaxMenu.module.scss";
import { useRouterContext } from "../../../../context/RouterContext";
import Link from "next/link";
import { TaxPageFeature } from "../../../../pages/dashboard/TaxPage";
import { ErrorMessage } from "../../shared/ErrorMessage/ErrorMessage";

const TaxMenu: React.FC<{
  choices: TaxPageFeature[];
  selected: TaxPageFeature | null;
  mobile?: boolean;
}> = ({ choices, selected, mobile }) => {
  const { taxPagePath } = useRouterContext();
  const containerStyles = [style.menu];
  if (mobile) containerStyles.push(style.menumobile);

  if (!taxPagePath) return <ErrorMessage>Missing tax page path to render menu</ErrorMessage>;

  return (
    <div className={containerStyles.join(" ")}>
      <ul>
        {choices
          .filter((c) => c != null)
          .map((c) => (
            <li
              className={
                selected && selected.slug.current == c.slug.current ? style["menu-selected"] : ""
              }
              key={c.slug.current}
            >
              <Link href={`${taxPagePath.join("/")}/${c.slug.current}`} passHref>
                <a>{c.title}</a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TaxMenu;

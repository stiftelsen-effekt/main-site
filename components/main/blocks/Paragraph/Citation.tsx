import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClickOutsideAlerter } from "../../../../hooks/useClickOutsideAlerter";
import { LinkComponent } from "../Links/Links";
import elements from "./Paragraph.module.scss";

export const formatHarvardCitation = ({
  author,
  title,
  year,
  url,
  publisher,
  accessed,
  pages,
  volume,
  number,
  journal,
  tabindex = -1,
}: any) => {
  const authorString = author ? `${author} ` : "";
  const titleString = title ? `"${title}"` : "";
  const yearString = year ? `(${year}) ` : "";
  const publisherString = publisher ? `${publisher}, ` : "";
  const accessDateString = accessed ? `(Hentet ${Intl.DateTimeFormat(accessed)}).` : "";
  const pagesString = pages ? `s. ${pages}` : "";
  const volumeString = volume ? `vol. ${volume}, ` : "";
  const numberString = number ? `no. ${number}, ` : "";
  const journalString = journal ? `${journal}, ` : "";

  return (
    <span className={elements.citation}>
      {authorString}
      {yearString}
      <a
        href={url}
        className={elements.citationLink}
        target="_blank"
        tabIndex={tabindex}
        rel="noreferrer"
        onClick={(e) => {
          e.stopPropagation();
          e.currentTarget.blur();
        }}
      >
        {titleString}
      </a>
      , {publisherString}
      <i>{journalString}</i>
      <span style={{ whiteSpace: "nowrap" }}>{volumeString}</span>
      <span style={{ whiteSpace: "nowrap" }}>{numberString}</span>
      <span style={{ whiteSpace: "nowrap" }}>{pagesString}</span>
      <span style={{ whiteSpace: "nowrap" }}>{accessDateString}</span>
    </span>
  );
};

export const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

export const reflowCitations = () => {
  if (typeof window === "undefined") return;
  if (window.innerWidth < 1180) return;
  const citations = document.querySelectorAll(".extendedcitation");
  // First reset them
  citations.forEach((citation) => {
    (citation as HTMLElement).style.transform = "translateY(-1.5rem)";
  });
  for (let i = 0; i < citations.length; i++) {
    const citation = citations[i] as HTMLElement;
    if (i > 0) {
      const prevBottom = citations[i - 1].getBoundingClientRect().bottom;
      const currentTop = citations[i].getBoundingClientRect().top;
      if (prevBottom + getRemInPixels() * 1.5 > currentTop) {
        const offset = prevBottom - currentTop;
        citation.style.transform = `translateY(calc(${offset}px))`;
      }
    }
  }
};

export const Citation = (props: any): JSX.Element => {
  const [index, setIndex] = useState(1);
  const [highlighted, setHighlighted] = useState(false);
  const extendedRef = useRef<HTMLElement | null>(null);

  const setCitationIndex = () => {
    if (extendedRef.current) {
      const citations = document.querySelectorAll(".citation");

      let k = 0;
      for (let i = 0; i < citations.length; i++) {
        if (citations[i] === extendedRef.current) {
          if (i > 0) {
            setIndex(k + 1);
          }
        }
        k += citations[i].querySelectorAll(".extendedcitation").length;
      }
    }
  };
  useEffect(setCitationIndex, [extendedRef]);
  useClickOutsideAlerter(extendedRef, () => setHighlighted(false));

  const highlighCitation = useCallback(() => {
    if (extendedRef.current) {
      if (window.innerWidth > 1180) {
        const firstExtended = extendedRef.current.querySelector(".extendedcitation");
        let offset = 0;
        if (firstExtended) {
          offset = firstExtended.getBoundingClientRect().top;
        }
        window.scrollTo({
          top: window.scrollY + offset - getRemInPixels() * 5,
          behavior: "smooth",
        });
      }
      extendedRef.current?.focus();
      setHighlighted(true);
    }
  }, [extendedRef]);

  return (
    <React.Fragment>
      <cite
        style={{ cursor: "pointer" }}
        ref={extendedRef}
        className={"citation"}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
            highlighCitation();
          }
        }}
        onClick={(e) => {
          e.currentTarget.blur();
          highlighCitation();
        }}
      >
        {props.children}

        <sup>{props.value.citations.map((citation: any, i: number) => index + i).join(",")}</sup>

        {props.value.citations.map((citation: any, i: number) => (
          <span
            className={["extendedcitation", highlighted ? elements.citationHighlighted : ""].join(
              " ",
            )}
            onBlur={() => setHighlighted(false)}
          >
            <strong>{index + i}.</strong>
            {formatHarvardCitation({ ...citation, tabindex: highlighted ? 0 : -1 })}
          </span>
        ))}
      </cite>
    </React.Fragment>
  );
};

export const customComponentRenderers = {
  marks: {
    citation: Citation,
    link: (props: any) => <LinkComponent link={props.value} children={props.children} />,
    navitem: (props: any) => <LinkComponent link={props.value} children={props.children} />,
  },
};

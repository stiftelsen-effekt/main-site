import { PortableText } from "@portabletext/react";
import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClickOutsideAlerter } from "../../../../hooks/useClickOutsideAlerter";
import { LinkComponent } from "../Links/Links";
import elements from "./Paragraph.module.scss";
import citation from "../../../../studio/schemas/types/citation";

export const formatHarvardCitation = ({
  type,
  author,
  title,
  year,
  url,
  publisher,
  address,
  edition,
  accessed,
  pages,
  volume,
  number,
  journal,
  timestamp,
  serie,
  number_in_serie,
  note,
  tabindex = -1,
}: any) => {
  const authorString = author ? `${author} ` : "";
  const titleString = title ? `"${title}"` : "";
  const yearString = year ? `(${year}) ` : "";
  const publisherString = publisher ? `${publisher} ` : "";
  const addressString = address ? `${address}: ` : "";
  const accessDateString = accessed
    ? ` (Hentet: ${Intl.DateTimeFormat("no-NB").format(new Date(accessed))}).`
    : "";
  const pagesString = pages ? `s. ${pages}` : "";
  const volumeString = volume ? `vol. ${volume}, ` : "";
  const numberString = number ? `no. ${number}, ` : "";
  const journalString = journal ? `${journal}, ` : "";
  const timestampString = timestamp ? ` (Tidsstempel: ${timestamp}) ` : "";
  const editionString = edition ? ` ${edition}. utgave, ` : "";
  const noteString = note ? `${note}` : "";
  const serieString = serie ? ` ${serie} ` : "";
  const numberInSerieString = number_in_serie ? `No. ${number_in_serie}. ` : "";

  return (
    <span className={elements.citation}>
      {type === "article" && (
        <>
          <span>{authorString} </span>
          <span style={{ whiteSpace: "nowrap" }}>{yearString}</span>
          {url ? (
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
          ) : (
            <i>{titleString}</i>
          )}
          ,&nbsp;
          <i>{journalString}</i>
          <span style={{ whiteSpace: "nowrap" }}>{volumeString}</span>
          <span style={{ whiteSpace: "nowrap" }}>{numberString}</span>
          <span style={{ whiteSpace: "nowrap" }}>{pagesString}</span>
        </>
      )}
      {type === "book" && (
        <>
          <span>{authorString} </span>
          <span style={{ whiteSpace: "nowrap" }}>{yearString}</span>
          <i>{titleString}</i>,&nbsp;
          <span>{editionString}</span>
          <span>{addressString}</span>
          <span>{publisherString}</span>
        </>
      )}
      {type === "website" && (
        <>
          <span>{authorString} </span>
          <span style={{ whiteSpace: "nowrap" }}>{yearString}</span>
          {url ? (
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
          ) : (
            <i>{titleString}</i>
          )}
          <span>{accessDateString}</span>
        </>
      )}
      {type === "video" && (
        <>
          <span>{authorString} </span>
          <span style={{ whiteSpace: "nowrap" }}>{yearString}</span>
          {url ? (
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
          ) : (
            <i>{titleString}</i>
          )}
          <span>{timestampString}</span>
          <span>{accessDateString}</span>
        </>
      )}
      {type === "podcast" && (
        <>
          <span>{authorString} </span>
          <span style={{ whiteSpace: "nowrap" }}>{yearString}</span>
          {url ? (
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
          ) : (
            <i>{titleString}</i>
          )}
          <span>{timestampString}</span>
          <span>{accessDateString}</span>
        </>
      )}
      {type === "misc" && (
        <>
          <span>{authorString} </span>
          <span style={{ whiteSpace: "nowrap" }}>{yearString}</span>
          {url ? (
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
          ) : (
            <i>{titleString}</i>
          )}
        </>
      )}
      {type === "workingpaper" && (
        <>
          <span>{authorString} </span>
          <span style={{ whiteSpace: "nowrap" }}>{yearString}</span>
          {url ? (
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
          ) : (
            <i>{titleString}</i>
          )}
          <span>{serieString}</span>
          <span style={{ whiteSpace: "nowrap" }}>{numberInSerieString}</span>
          <span>{accessDateString}</span>
        </>
      )}
      {type === "note" && <PortableText value={note} />}
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

        <sup>
          {props.value.citations &&
            props.value.citations.map((citation: any, i: number) => index + i).join(",")}
        </sup>

        {props.value.citations &&
          props.value.citations.map((citation: any, i: number) =>
            citation != null ? (
              <span
                key={citation._id}
                className={[
                  "extendedcitation",
                  highlighted ? elements.citationHighlighted : "",
                ].join(" ")}
                onBlur={() => setHighlighted(false)}
              >
                <strong>{index + i}.</strong>
                {formatHarvardCitation({ ...citation, tabindex: highlighted ? 0 : -1 })}
              </span>
            ) : null,
          )}
      </cite>
    </React.Fragment>
  );
};

const Latex: React.FC<{ value: { renderedHtml: string } }> = ({ value }) => {
  useEffect(() => {
    if (document.getElementById("katex-styles-link")) return;

    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    link.id = "katex-styles-link";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return (
    <span
      dangerouslySetInnerHTML={{ __html: value.renderedHtml }}
      style={{
        padding: "3rem",
        textAlign: "center",
        display: "block",
        width: "100%",
      }}
    ></span>
  );
};

export const customComponentRenderers = {
  marks: {
    citation: Citation,
    link: (props: any) => <LinkComponent link={props.value}>{props.children}</LinkComponent>,
    navitem: (props: any) => <LinkComponent link={props.value}>{props.children}</LinkComponent>,
  },
  types: {
    latex: Latex,
  },
};

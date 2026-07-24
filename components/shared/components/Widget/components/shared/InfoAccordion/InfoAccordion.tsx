import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown } from "react-feather";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { ExplenationAccordion } from "../../panes/AmountPane.style";

interface InfoAccordionProps {
  labelText: string;
  description?: any[];
  link?: { href: string; text: string };
}

/**
 * Expandable info box, matching the accordion used for the smart
 * distribution explanation (see SmartDistributionForm.tsx).
 */
export const InfoAccordion: React.FC<InfoAccordionProps> = ({ labelText, description, link }) => {
  const [open, setOpen] = useState(false);

  return (
    <ExplenationAccordion>
      <div onClick={() => setOpen(!open)}>
        <span>{labelText}</span>
        <ChevronDown
          size={28}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </div>
      <AnimateHeight height={open ? "auto" : 0}>
        <div>
          {description && <PortableText value={description} />}
          {link && (
            <Link
              href={link.href}
              target="_blank"
              style={{ borderBottom: "1px solid var(--primary)" }}
            >
              {link.text} ↗
            </Link>
          )}
        </div>
      </AnimateHeight>
    </ExplenationAccordion>
  );
};

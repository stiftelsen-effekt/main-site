import React from "react";
import style from "./Lightbox.module.scss";
import { EffektButton, EffektButtonType } from "../EffektButton/EffektButton";
import { X } from "react-feather";

export const LightboxWithoutBotton: React.FC<{
  children: React.ReactNode;
  open: boolean;
  onCancel?: () => void;
}> = ({ children, onCancel, open }) => {
  if (!open) return null;

  return (
    <div className={style.lightboxWrapper} onClick={(e) => e.stopPropagation()} data-cy="lightbox">
      <div className={style.lightbox}>
        {onCancel && (
          <div className={style.lightboxCloseButton} onClick={onCancel}>
            <X size={"1.5rem"} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

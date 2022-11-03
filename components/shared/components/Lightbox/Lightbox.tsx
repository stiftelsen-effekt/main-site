import React from "react";
import style from "./Lightbox.module.scss";
import { EffektButton, EffektButtonType } from "../EffektButton/EffektButton";
import { X } from "react-feather";

export const Lightbox: React.FC<{
  children: React.ReactNode;
  open: boolean;
  valid?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ children, open, valid, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className={style.lightboxWrapper}>
      <div className={style.lightbox}>
        <div className={style.lightboxCloseButton} onClick={onCancel}>
          <X size={"1.5rem"} />
        </div>
        {children}
        <div className={style.buttonWrapper}>
          <EffektButton
            onClick={onConfirm}
            cy="lightbox-confirm"
            disabled={typeof valid === "boolean" ? !valid : false}
          >
            Bekreft
          </EffektButton>
          <EffektButton onClick={onCancel} type={EffektButtonType.SECONDARY} cy="lightbox-cancel">
            Avbryt
          </EffektButton>
        </div>
      </div>
    </div>
  );
};

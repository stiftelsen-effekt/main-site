import React from "react";
import style from "./Lightbox.module.scss";
import { EffektButton, EffektButtonType } from "../EffektButton/EffektButton";

export const Lightbox: React.FC<{
  children: React.ReactNode;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ children, open, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className={style.lightboxWrapper}>
      <div className={style.lightbox}>
        {children}
        <div className={style.buttonWrapper}>
          <EffektButton onClick={onConfirm} cy="lightbox-confirm">
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

import React from "react";
import style from "../../styles/Lightbox.module.css";

export const Lightbox: React.FC<{ 
  children: React.ReactNode, 
  open: boolean, 
  onConfirm: () => void, 
  onCancel: () => void }> = ({
    children, 
    open, 
    onConfirm, 
    onCancel
  }) => {

  if (!open)
    return null;

  return (
    <div className={style.lightboxWrapper}>
      <div className={style.lightbox}>
        {children}
        <div className={style.buttonWrapper}>
          <button className={style.button} onClick={onConfirm} data-cy="lightbox-confirm">Bekreft</button>
          <button className={style.button} onClick={onCancel} data-cy="lightbox-cancel">
            Avbryt
          </button>
        </div>
      </div>
    </div>
  )
};

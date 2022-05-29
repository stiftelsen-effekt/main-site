import React from "react";
import { X } from "react-feather";
import elements from "../../styles/Elements.module.css";

export const WidgetPane: React.FC<{ open: boolean, onClose: () => void }> = ({open, onClose}) => {
  return <div className={`${elements.widgetPane} ${open ? elements.widgetPaneOpen : null}`}>
    <div className={elements.widgetCloseBtn} onClick={onClose}>
      <X width={36} height={36} color={'white'} />
    </div>
    <h2>Donasjonswidget</h2>
  </div>
}
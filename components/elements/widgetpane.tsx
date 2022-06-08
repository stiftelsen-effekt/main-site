import React, { useState } from "react";
import { X } from "react-feather";
import elements from "../../styles/Elements.module.css";
import { Widget } from "../widget/components/Widget";

export const WidgetPane: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const followThreshold = 20;
  const closeThreshold = 140;
  const [initialY, setInitialY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const delta = currentY - initialY;

  let style = {};
  if (open && dragging)
    style = {
      transform: `translateY(${Math.max(delta - followThreshold, 0)}px)`,
      transition: "none",
    };

  return (
    <div
      className={`${elements.widgetPane} ${open ? elements.widgetPaneOpen : null}`}
      style={style}
    >
      <div
        className={elements.widgetPaneHeader}
        onTouchStart={(e) => {
          setInitialY(e.touches[0].clientY);
          setCurrentY(e.touches[0].clientY);
          setDragging(true);
        }}
        onTouchMove={(e) => {
          setCurrentY(e.touches[0].clientY);
          return false;
        }}
        onTouchEnd={(e) => {
          setDragging(false);
          if (delta > closeThreshold) {
            onClose();
          }
          setInitialY(0);
          setCurrentY(0);
        }}
      >
        <button className={elements.widgetCloseBtn} onClick={onClose}>
          <X width={36} height={36} color={"white"} />
        </button>
      </div>
      <div className={elements.widgetPaneContent}>
        <Widget />
      </div>
    </div>
  );
};

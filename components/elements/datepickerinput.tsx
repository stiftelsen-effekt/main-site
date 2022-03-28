import React, { useRef, useState } from "react";
import { useClickOutsideAlerter } from "../../hooks/useClickOutsideAlerter";
import style from "../../styles/Elements.module.css";
import { DatePicker } from "./datepicker";

export const DatePickerInput: React.FC<{ selected?: number, onChange: (selected: number) => void }> = ({ selected, onChange }) => {
  const [pickerOpen, setPickerOpen] = useState(false)
  
  let textValue = ''
  if (typeof selected !== "undefined")
    textValue = `${selected === 0 ? 'Siste dag i måneden' : selected + '. månedlig'}`

  return <div className={style["datepicker-input-wrapper"]}>
    <div 
      className={style["datepicker-container"]} 
      style={{ display: pickerOpen ? undefined : 'none' }}>
      <DatePicker selected={selected} onChange={(selected) => { onChange(selected); setPickerOpen(false); }} onClickOutside={() => setPickerOpen(false)}/>
    </div>
    <input readOnly={true} type={"text"} value={textValue} onClick={() => setPickerOpen(true)}/>
  </div>
}
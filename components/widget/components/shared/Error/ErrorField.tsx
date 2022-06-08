import React from "react";
import styled from "styled-components";

export const ErrorWrapper = styled.div`
  position: relative;
  left: 8px;
  margin-top: 0px;
  margin-bottom: 5px;
`;

export const ErrorMessage = styled.div`
  margin-left: 5px;
  font-size: 12px;
  color: red;
  display: inline;
  position: relative;
  bottom: 1px;
`;

interface Props {
  text: string;
  center?: boolean;
}

export const ErrorField: React.FC<Props> = ({ text, center }) => {
  return (
    <ErrorWrapper style={{ textAlign: center ? "center" : "start" }}>
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        version="1.1"
        viewBox="0 0 16 16"
        height="12"
        width="12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 1.45l6.705 13.363h-13.409l6.705-13.363zM8 0c-0.345 0-0.69 0.233-0.951 0.698l-6.829 13.611c-0.523 0.93-0.078 1.691 0.989 1.691h13.583c1.067 0 1.512-0.761 0.989-1.691h0l-6.829-13.611c-0.262-0.465-0.606-0.698-0.951-0.698v0z" />
        <path d="M9 13c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1z" />
        <path d="M8 11c-0.552 0-1-0.448-1-1v-3c0-0.552 0.448-1 1-1s1 0.448 1 1v3c0 0.552-0.448 1-1 1z" />
      </svg>
      <ErrorMessage>{text}</ErrorMessage>
    </ErrorWrapper>
  );
};

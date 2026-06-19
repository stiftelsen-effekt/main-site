import React from "react";
import styled, { keyframes } from "styled-components";

const shake = keyframes`
  0%   { transform: translateX(0) rotate(0deg); }
  15%  { transform: translateX(-2px) rotate(-8deg); }
  30%  { transform: translateX(3px) rotate(6deg); }
  45%  { transform: translateX(-3px) rotate(-4deg); }
  60%  { transform: translateX(2px) rotate(2deg); }
  75%  { transform: translateX(-1px) rotate(-1deg); }
  100% { transform: translateX(0) rotate(0deg); }
`;

export const ErrorWrapper = styled.div`
  padding-top: 12px;
  padding-bottom: 8px;
  padding-left: 12px;
  margin-bottom: 10px;
  color: var(--secondary);
  background: var(--primary);
  display: flex;
  align-items: center; /* keeps icon/text aligned nicely */
  gap: 12px;
`;

export const ErrorMessage = styled.div`
  position: relative;
`;

const ErrorIcon = styled.svg`
  display: inline-block;
  height: 20px;
  width: 20px;
  transform-origin: center;
  animation: ${shake} 500ms ease-in-out 1 both;

  /* Respect users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

interface Props {
  text: string;
  center?: boolean;
}

export const ErrorField: React.FC<Props> = ({ text, center }) => {
  return (
    <ErrorWrapper style={{ textAlign: center ? "center" : "start" }}>
      <ErrorIcon
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 16 16"
        role="img"
        aria-label="Error"
      >
        <path d="M8 1.45l6.705 13.363h-13.409l6.705-13.363zM8 0c-0.345 0-0.69 0.233-0.951 0.698l-6.829 13.611c-0.523 0.93-0.078 1.691 0.989 1.691h13.583c1.067 0 1.512-0.761 0.989-1.691h0l-6.829-13.611c-0.262-0.465-0.606-0.698-0.951-0.698v0z" />
        <path d="M9 13c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1z" />
        <path d="M8 11c-0.552 0-1-0.448-1-1v-3c0-0.552 0.448-1 1-1s1 0.448 1 1v3c0 0.552-0.448 1-1 1z" />
      </ErrorIcon>
      <ErrorMessage>{text}</ErrorMessage>
    </ErrorWrapper>
  );
};

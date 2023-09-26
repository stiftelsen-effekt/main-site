import styled from "styled-components";

export const StyledToggle = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 50px;
  height: 26px;
  border-radius: 13px;
  background-color: ${({ active }) => (active ? "var(--primary)" : "var(--inactive)")};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  position: relative;

  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 3px;
  }

  &:active {
    outline: none;
  }
`;

export const StyledToggleCircle = styled.div<{ active: boolean }>`
  height: 22px;
  aspect-ratio: 1;
  margin-left: 3px;
  border-radius: 50%;
  background-color: var(--secondary);
  transition: transform 0.2s ease-in-out;
  transform: translateX(${({ active }) => (active ? "100%" : "0")});
`;

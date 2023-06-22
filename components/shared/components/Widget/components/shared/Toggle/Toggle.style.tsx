import styled from "styled-components";

export const StyledToggle = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ active }) => (active ? "var(--primary)" : "var(--inactive)")};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  position: relative;
`;

export const StyledToggleCircle = styled.div<{ active: boolean }>`
  height: 90%;
  aspect-ratio: 1;
  margin-left: 5%;
  border-radius: 50%;
  background-color: var(--secondary);
  transition: transform 0.2s ease-in-out;
  transform: translateX(${({ active }) => (active ? "100%" : "0")});
`;

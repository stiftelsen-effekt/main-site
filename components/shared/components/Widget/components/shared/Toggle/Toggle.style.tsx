import styled from "styled-components";

export const StyledToggle = styled.button.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !["active"].includes(prop),
})<{ active: string }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 50px;
  height: 26px;
  border-radius: 13px;
  background-color: ${({ active }) => (active === "true" ? "var(--primary)" : "var(--inactive)")};
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

export const StyledToggleCircle = styled.div.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !["active"].includes(prop),
})<{ active: string }>`
  height: 22px;
  aspect-ratio: 1;
  margin-left: 3px;
  border-radius: 50%;
  background-color: var(--secondary);
  transition: transform 0.2s ease-in-out;
  transform: translateX(${({ active }) => (active === "true" ? "100%" : "0")});
`;

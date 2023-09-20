import styled from "styled-components";

export const PercentageInputWrapper = styled.div<{ unbalanced: boolean }>`
  margin: 10px 0px ${(props) => (props.unbalanced ? "60px" : "30px")} 0px;
  border-radius: 10px;
  position: relative;
  transition: margin 0.2s ease-in-out;

  span {
    position: relative;
    display: inline-flex;
    width: 100%;
    border: 1px solid var(--primary);
    border-radius: 10px;
    overflow: hidden;

    input {
      background: transparent;
      padding: 8px 20px;
      border: none;
      color: var(--primary);
      font-size: 28px;
      width: 100%;
      mix-blend-mode: difference;
    }
    &:after {
      content: "%";
      color: var(--primary);
      position: absolute;
      right: 10px;
      top: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 28px;
      mix-blend-mode: difference;
    }
  }
`;

export const PercentageInputWrapperShading = styled.div<{ percentage: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${(props) => props.percentage}%;
  height: 100%;
  transition: width 0.2s ease-in-out;
  z-index: -1;
  background: var(--primary);
`;

export const PercentageInputBalanceArrow = styled.button<{
  percentage: number;
  unbalanced: boolean;
}>`
  position: absolute;
  bottom: -30px;
  left: calc(${(props) => props.percentage}% - 17px);
  transition: all 0.2s ease-in-out;
  border: none;
  cursor: pointer;
  opacity: ${(props) => (props.unbalanced ? "1" : "0")};
  padding-left: 12px;
  padding-right: 12px;

  &:focus {
    outline: 1px solid var(--primary);
  }

  &:hover {
    padding-bottom: 2px;
  }
`;

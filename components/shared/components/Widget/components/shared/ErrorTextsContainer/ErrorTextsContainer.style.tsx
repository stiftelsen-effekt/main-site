import styled from "styled-components";

export const ErrorsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding: 0px 40px;
  width: calc(100% + 80px);
  left: -40px;
  position: relative;
  background: var(--primary);
  color: red;
  font-size: 16px;

  & > div:has(div[aria-hidden="false"]) {
    padding-bottom: 30px;
    /*background: green;*/
  }

  & > div:first-child ~ div:has(div[aria-hidden="false"]) {
    /*background: orange;*/
    padding-top: 30px;

    & ~ div {
      padding-top: 0px;
      /*background: green;*/
    }
  }

  & > div {
    /*background: blue;*/
    transition: padding 0.2s ease;
    padding-top: 0px;
  }

  button {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 10px;
    align-items: start;
    cursor: pointer;

    &:focus {
      outline: 1px solid red;
    }

    &:active {
      outline: none;
    }

    span {
      text-align: left;
    }
  }
`;

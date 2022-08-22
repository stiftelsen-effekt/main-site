import styled from "styled-components";

export const Paragraph = styled.p`
  -webkit-font-smoothing: antialiased;
  font-weight: 300;
  box-sizing: content-box;
  margin-top: 30px;
  padding: 20px;
  border: 0;
  font-size: 18px;
  line-height: 30px;
  text-align: left;
  font-family: "Roboto";
  max-width: 850px;
  word-wrap: normal;
  @media only screen and (max-width: 1180px) {
    font-size: 22px;
    line-height: 30px;
  }
`;

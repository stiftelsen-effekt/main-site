import styled from "styled-components";

export const Pane = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;

  font-size: 18px;
  line-height: 30px;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
    line-height: 30px;
  }
`;

export const PaneContainer = styled.div`
  padding: 0;
  min-height: 500px;
  display: grid;
  grid-template-rows: 1fr max-content;
  height: 100%;
  padding-bottom: 20px;
  padding-left: 40px;
  padding-right: 40px;
`;

export const PaneTitle = styled.h2`
  font-family: "ESKlarheitKurrent";
  font-size: 27px;
  margin-top: 0px;
  margin-top: 20px;
  margin-bottom: 20px;
  line-height: normal;
`;

export const BoldTitle = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
`;

export const UnderTitle = styled.p`
  margin: 15px;
  margin-left: 5px;
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--primary);
`;

export const HorizontalLine = styled.div`
  height: 1px;
  background-color: var(--secondary);
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
`;

export const VerticalLine = styled.div`
  width: 1px;
  height: 30px;
  background-color: #ffaa2b;
  margin-bottom: 5px;
`;

export const ErrorMessage = styled.div`
  font-size: 20px;
  padding-left: 2px;
`;

export const NavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

export const LoadingIcon = styled.img`
  width: 80px;
  height: 80px;
  -webkit-animation: spin 1.5s linear infinite;
  -moz-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

export const CenterDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

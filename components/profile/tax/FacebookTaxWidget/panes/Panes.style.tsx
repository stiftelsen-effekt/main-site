import styled from "styled-components";

export const Pane = styled.div`
  padding: 20px;
  padding-top: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const PaneContainer = styled.div`
  align-items: center;
  justify-content: center;
  padding: 0;
`;

export const PaneTitle = styled.p`
  font-size: 25px;
  margin-top: 0;
  margin-bottom: 10px;
  margin-left: 5px;
  align-self: center;
  font-family: Arial, Helvetica, sans-serif;
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
`;

export const OrangeLink = styled.a`
  margin-left: -368px;
  top: -12px;
  color: #ffaa2b;
  display: inline;
  text-decoration-color: #ffaa2b;
  font-size: 15px;
  position: relative;
  bottom: 2px;

  &:hover {
    opacity: 0.5;
  }
`;

export const HorizontalLine = styled.div`
  height: 1px;
  background-color: #ffaa2b;
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
  font-size: 12px;
  color: red;
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

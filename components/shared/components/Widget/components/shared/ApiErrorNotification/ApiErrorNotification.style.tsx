import styled, { keyframes } from "styled-components";

const slideInFromTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const NotificationWrapper = styled.div`
  position: relative;
  z-index: 1000;
  margin-bottom: 1rem;
  animation: ${slideInFromTop} 0.3s ease-out;
`;

export const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  background: var(--primary);
  color: var(--secondary);
  position: relative;
  overflow: hidden;

  transition: all 0.3s ease;

  &:hover {
    animation-play-state: paused;
  }
`;

export const NotificationIcon = styled.div`
  color: var(--secondary);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
`;

export const NotificationMessage = styled.div`
  line-height: 1.4;
  flex: 1;
  margin-top: 4px;
`;

export const NotificationCloseButton = styled.button`
  color: var(--secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

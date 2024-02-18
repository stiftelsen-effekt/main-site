declare module "react-device-detect" {
  export function useDeviceSelectors(
    userAgent?: string,
  ): [{ isMobile: boolean; isDesktop: boolean; isTablet: boolean }];
}

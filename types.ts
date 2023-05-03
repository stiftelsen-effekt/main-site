import { NextPage } from "next";
import { ReactElement } from "react";
import { WidgetProps } from "./components/shared/components/Widget/types/WidgetProps";
import { FooterProps } from "./components/shared/layout/Footer/Footer";

export type LayoutProps = {
  footerData: FooterProps;
  widgetData: WidgetProps;
};

export * from "./studio/types";

import { NextPage } from "next";
import { ReactElement } from "react";
import { WidgetProps } from "./components/shared/components/Widget/types/WidgetProps";
import { FooterProps } from "./components/shared/layout/Footer/Footer";

export type LayoutPage<P = {}> = NextPage<P> & {
  layout: LayoutElement;
  filterPage?: boolean;
};
export type LayoutElement = React.FC<{
  children: ReactElement;
  footerData: FooterProps;
  widgetData: WidgetProps;
}>;

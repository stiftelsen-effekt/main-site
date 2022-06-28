import { NextPage } from "next";
import { ReactElement } from "react";
import { FooterProps } from "./components/shared/layout/Footer/Footer";

export type LayoutPage<P = {}> = NextPage<P> & { layout: LayoutElement };
export type LayoutElement = React.FC<{ children: ReactElement, footerData: FooterProps }>;

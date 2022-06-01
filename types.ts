import { NextPage } from "next";
import { ReactElement } from "react";

export type LayoutPage<P = {}> = NextPage<P> & { layout: LayoutElement };
export type LayoutElement = React.FC<{ children: ReactElement }>;

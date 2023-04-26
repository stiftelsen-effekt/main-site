import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { ParsedUrlQuery } from "querystring";
import { RouterContextValue, fetchRouterContext } from "../context/RouterContext";

export enum LayoutType {
  Default = "default",
  Profile = "profile",
}

export type AppStaticProps = {
  routerContext: RouterContextValue;
  preview: boolean;
  layout: LayoutType;
  filterPage: boolean;
};

type GetStaticPropsWithAppStaticProps<Props, Params extends ParsedUrlQuery> = (
  context: GetStaticPropsContext<Params>,
  appProps: AppStaticProps,
) => Promise<GetStaticPropsResult<Props>>;

export const withAppStaticProps =
  <Params extends ParsedUrlQuery = ParsedUrlQuery>(
    options?: Partial<Pick<AppStaticProps, "layout" | "filterPage">>,
  ) =>
  <
    StaticProps extends Record<string, any>,
    PropsFn extends GetStaticPropsWithAppStaticProps<StaticProps, Params>,
  >(
    extraStaticProps: PropsFn,
  ) => {
    return async (context: Parameters<PropsFn>[0]) => {
      const routerContext = await fetchRouterContext();
      const appStaticProps: AppStaticProps = {
        routerContext,
        preview: context.preview ?? false,
        layout: options?.layout ?? LayoutType.Default,
        filterPage: options?.filterPage ?? false,
      };
      const staticProps = (await extraStaticProps(context, appStaticProps)) as GetStaticPropsResult<
        PropsFn extends GetStaticPropsWithAppStaticProps<infer P, Params> ? P : never
      >;
      return {
        ...staticProps,
        props: {
          ...("props" in staticProps ? staticProps.props : ({} as never)),
          appStaticProps,
        },
      };
    };
  };

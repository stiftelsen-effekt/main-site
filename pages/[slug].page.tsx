import { InferGetStaticPropsType, NextPage } from "next";
import { LayoutPage, PageTypes } from "../types";
import { GenericPage, getGenericPagePaths } from "./GenericPage";
import { Layout } from "../components/main/layout/layout";

const Page: LayoutPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ data, preview }) => {
  return <GenericPage data={data} preview={preview} />;
};

export async function getStaticProps({ preview = false, params = { slug: "" } }) {
  const { slug } = params;

  const props = await GenericPage.getStaticProps({ preview, slug });

  return {
    props,
  };
}

export async function getStaticPaths() {
  const genericPagePaths = await getGenericPagePaths();

  return {
    paths: genericPagePaths.map((slug) => ({
      params: { slug },
    })),
    fallback: false,
  };
}

Page.layout = Layout;
Page.filterPage = true;

export default Page;

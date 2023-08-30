import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { groq } from "next-sanity";
import React from "react";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";

import { Navbar } from "../components/main/layout/navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { getAppStaticProps } from "./_app.page";

const Custom404: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ navbar }) => {
  return (
    <>
      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar {...navbar} />
      </MainHeader>

      <SectionContainer>
        <h2 style={{ marginTop: "10vh" }}>Finner ikke siden</h2>
      </SectionContainer>
    </>
  );
};

export const getStaticProps = async ({ preview = false }: GetStaticPropsContext) => {
  const appStaticProps = await getAppStaticProps({ preview });

  return {
    props: {
      appStaticProps,
      navbar: await Navbar.getStaticProps({ preview }),
    },
  };
};

export default Custom404;

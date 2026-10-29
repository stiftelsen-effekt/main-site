import { Navbar, PreviewNavbar } from "../components/shared/components/Navbar/Navbar";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { GeneralPageProps, getAppStaticProps } from "./_app.page";
import { ConsentState } from "../proxy.page";
import { GetStaticProps } from "next";
import { GiftCards } from "../components/main/blocks/GiftCards/GiftCards";

interface GiftCardsTestProps extends GeneralPageProps {
  navbar: Awaited<ReturnType<typeof Navbar.getStaticProps>>;
}

export const getStaticProps: GetStaticProps<GiftCardsTestProps> = async () => {
  const draftMode = false;
  const consentState = "undecided" as ConsentState;

  const appStaticProps = await getAppStaticProps({ draftMode, consentState });

  return {
    props: {
      appStaticProps,
      draftMode,
      preview: draftMode,
      token: null,
      navbar: await Navbar.getStaticProps({ dashboard: false, draftMode }),
    },
  };
};

const PLACEHOLDER_IMAGE = {
  asset: {
    _ref: "image-ff92d1301ba8e2c9cab2a98b6b23a85fa7b1c1a9-800x800-png",
    _type: "reference",
  },
};

const mockGiftCards = [
  {
    _key: "1",
    title: "Beskytt et barn mot malaria",
    price: 100,
    image: PLACEHOLDER_IMAGE,
    links: [{ _type: "link", _key: "l1", title: "Kjøp gavekort", url: "https://example.com" }],
  },
  {
    _key: "2",
    title: "Gi vitamin A til et barn",
    price: 50,
    image: PLACEHOLDER_IMAGE,
    links: [{ _type: "link", _key: "l2", title: "Kjøp gavekort", url: "https://example.com" }],
  },
  {
    _key: "3",
    title: "Støtt et vaksineprogram",
    price: 250,
    image: PLACEHOLDER_IMAGE,
    links: [{ _type: "link", _key: "l3", title: "Kjøp gavekort", url: "https://example.com" }],
  },
  {
    _key: "4",
    title: "En måned med kontantoverføring",
    price: 1000,
    image: PLACEHOLDER_IMAGE,
    links: [{ _type: "link", _key: "l4", title: "Kjøp gavekort", url: "https://example.com" }],
  },
  {
    _key: "5",
    title: "Gavekort uten pris",
    image: PLACEHOLDER_IMAGE,
    links: [{ _type: "link", _key: "l5", title: "Kjøp gavekort", url: "https://example.com" }],
  },
];

export default function GiftCardsTestPage({ navbar, draftMode }: GiftCardsTestProps) {
  return (
    <>
      <MainHeader hideOnScroll={true}>
        {draftMode ? <PreviewNavbar {...navbar} /> : <Navbar {...navbar} />}
      </MainHeader>

      <SectionContainer heading="Gift cards test" ypadded>
        <GiftCards giftcards={mockGiftCards as any} />
      </SectionContainer>
    </>
  );
}

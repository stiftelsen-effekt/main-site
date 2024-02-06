import Script from "next/script";

export const GoogleAnalytics: React.FC<{ gaMeasurementId: string }> = ({ gaMeasurementId }) => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      ></Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${gaMeasurementId}');
`}
      </Script>
    </>
  );
};

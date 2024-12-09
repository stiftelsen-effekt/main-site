import Link from "next/link";

interface CustomLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
  href: string | { pathname: string; query?: { [key: string]: string } };
}

export const CustomLink = ({ href, ...props }: CustomLinkProps) => {
  if (href === "/") {
    return <Link href="/[state]/index" as="/" {...props} />;
  }

  let cleanHref;
  // Remove any leading slash for consistency
  if (typeof href === "object" && href.pathname) {
    cleanHref = href.pathname.startsWith("/") ? href.pathname.slice(1) : href.pathname;
    return (
      <Link
        href={{
          pathname: `/${cleanHref}`,
          query: href.query,
        }}
        {...props}
      />
    );
  } else if (typeof href === "string") {
    cleanHref = href.startsWith("/") ? href.slice(1) : href;
    return <Link href={`/[state]/${cleanHref}`} as={`/${cleanHref}`} {...props} />;
  }

  return <Link href="/[state]/index" as="/" {...props} />;
};

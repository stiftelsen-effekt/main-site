import Link from "next/link";

interface CustomLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
  href: string;
}

export const CustomLink = ({ href, ...props }: CustomLinkProps) => {
  if (href === "/") {
    return <Link href="/" {...props} />;
  }

  // Remove any leading slash for consistency
  const cleanHref = href.startsWith("/") ? href.slice(1) : href;

  // Use the internal pattern for Next.js routing while showing the clean URL
  return <Link href={`/[state]/${cleanHref}`} as={`/${cleanHref}`} {...props} />;
};

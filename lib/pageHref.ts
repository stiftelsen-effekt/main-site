/**
 * Resolves a CMS page to a site path the same way navitems do in Links.getHref.
 * Article and fundraiser slugs are nested under their overview page slugs.
 */
export function resolveNavitemHref(
  pagetype: string | undefined,
  slug: string,
  articlesPagePath: string[],
  fundraisersPath: string[],
): string {
  switch (pagetype) {
    case "article_page":
      return joinPath([...articlesPagePath, slug]);
    case "fundraiser_page":
      return joinPath([...fundraisersPath, slug]);
    default:
      return joinPath([slug]);
  }
}

export function appendQueryAndHash(path: string, query?: string, hash?: string): string {
  const [withoutHash, existingHash = ""] = splitOnce(path, "#");
  const [pathname, existingQuery = ""] = splitOnce(withoutHash, "?");

  const queryParts = [existingQuery, stripPrefix(query, "?")].filter(Boolean);
  const hashValue = stripPrefix(hash, "#") || existingHash;

  return (
    pathname +
    (queryParts.length > 0 ? `?${queryParts.join("&")}` : "") +
    (hashValue ? `#${hashValue}` : "")
  );
}

function joinPath(parts: string[]): string {
  const segments = parts.flatMap((part) => part.split("/")).filter(Boolean);
  return `/${segments.join("/")}`;
}

function splitOnce(value: string, separator: string): [string, string?] {
  const index = value.indexOf(separator);
  if (index === -1) return [value];
  return [value.slice(0, index), value.slice(index + 1)];
}

function stripPrefix(value: string | undefined, prefix: string): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  return trimmed.startsWith(prefix) ? trimmed.slice(prefix.length) : trimmed;
}

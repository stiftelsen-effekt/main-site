type Slug = {
  current: string;
};

function isSlug(slug: unknown): slug is Slug {
  return typeof slug === "object" && slug !== null && "current" in slug;
}

/**
 * Validates that a slug is shallow (i.e. does not contain slashes)
 */
export function isShallowSlug(slug: unknown) {
  if (!isSlug(slug)) {
    return "Slug must be a slug";
  }

  return !slug.current.includes("/") || "Slug cannot contain slashes";
}

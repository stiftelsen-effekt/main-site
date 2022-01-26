import { groq } from "next-sanity";

export const fetchAboutUs = groq`
{
  "about": *[_type == "about_us"] {
    content
  },
  "people": *[_type == "role"] {
    title,
    "members": *[ _type == "contributor" && role._ref == ^._id ] {
      name,
      email,
      subrole,
      additional
    }
  }[count(members) > 0]
}
`
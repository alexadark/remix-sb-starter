import { getStoryblokApi } from "@storyblok/react";

export const getAllSlugs = async () => {
  let sbParams = {
    version: "draft",
  };

  let {
    data: { links },
  } = await getStoryblokApi().get("cdn/links", sbParams);

  const slugs = Object.values(links).map((link) => link.slug);

  return slugs;
};

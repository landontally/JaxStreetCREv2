import { client } from '$lib/sanity';

export async function load() {
  const query = `
    *[_type == "aboutPage"][0] {
      "heroImage": heroImage.asset->url
    }
  `;

  const aboutPageData = await client.fetch(query);

  return {
    aboutPage: aboutPageData || {}
  };
}
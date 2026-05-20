import { client } from '$lib/sanity';

export async function load() {
  // Fetch properties where status is '100% Leased'
  const query = `
    *[_type == "property" && status == "100% Leased"] | order(_createdAt desc) {
      title,
      location,
      "type": type->title,
      status,
      "image": mainImage.asset->url,
      "slug": slug.current,
      coordinates
    }
  `;

  const properties = await client.fetch(query);

  return {
    properties: properties || []
  };
}
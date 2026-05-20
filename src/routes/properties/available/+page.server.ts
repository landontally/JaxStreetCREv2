import { client } from '$lib/sanity';

export async function load() {
  // Fetch all properties where status is 'Available'
  const query = `
    *[_type == "property" && status == "Available"] | order(_createdAt desc) {
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
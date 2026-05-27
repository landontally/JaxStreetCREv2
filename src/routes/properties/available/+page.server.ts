import { client } from '$lib/sanity';

export async function load() {
  // Fetch all properties where status is 'Available'
  const propertiesQuery = `
      *[_type == "property" && status == "Available"] | order(_createdAt desc) {
        title,
        _createdAt,
        location,
        "type": type->title,
        status,
        tenants,
        coordinates,
        "image": mainImage.asset->url,
        "slug": slug.current
      }
    `;

  // Updated this line to match the variable name above!
  const properties = await client.fetch(propertiesQuery);

  return {
    properties: properties || []
  };
}
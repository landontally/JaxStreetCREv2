import { client, urlFor } from '$lib/sanity';

export async function load() {
  // Fetch properties where status is exactly '100% Leased'
  const query = `
    *[_type == "property" && status == "100% Leased"] | order(_createdAt desc) {
      title,
      _createdAt,
      location,
      "type": type->title,
      status,
      tenants,
      coordinates,
      mainImage,
      "slug": slug.current
    }
  `;

  const rawProperties = await client.fetch(query);

  // Map through the properties and generate the optimized URLs
  const properties = (rawProperties || []).map((prop: any) => ({
    ...prop,
    image: prop.mainImage 
        ? urlFor(prop.mainImage).width(800).format('webp').url() 
        : '/PLACEHOLDER.jpg'
  }));

  return {
    properties
  };
}
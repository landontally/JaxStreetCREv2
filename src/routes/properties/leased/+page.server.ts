import { client, urlFor } from '$lib/sanity';

export async function load() {
  // 1. Fetch only properties where status == "Leased"
  const propertiesQuery = `
      *[_type == "property" && status == "Leased"] | order(_createdAt desc) {
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

  const rawProperties = await client.fetch(propertiesQuery);

  // 2. Map through the properties and generate the optimized URLs
  const properties = rawProperties.map((prop: any) => ({
    ...prop,
    image: prop.mainImage ? urlFor(prop.mainImage).width(800).format('webp').url() : '/PLACEHOLDER.jpg'
  }));

  return {
    properties: properties || []
  };
}
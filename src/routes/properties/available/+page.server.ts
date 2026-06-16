import { client, urlFor } from '$lib/sanity';

// 1. Add setHeaders to the load function parameters
export async function load({ setHeaders }) {
  
  setHeaders({
    'Cache-Control': 'public, max-age=300, s-maxage=300'
  });

  const propertiesQuery = `
      *[_type == "property" && status == "Available"] | order(_createdAt desc) {
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
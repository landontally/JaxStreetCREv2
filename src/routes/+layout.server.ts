import { client, urlFor } from '$lib/sanity';

export async function load() {
  // Added "tenants" to the query!
  const query = `
    *[_type == "property"] | order(_createdAt desc) {
      title,
      location,
      status,
      tenants, 
      "type": type->title,
      mainImage,
      "slug": slug.current
    }
  `;

  const rawProperties = await client.fetch(query);

  const allProperties = (rawProperties || []).map((prop: any) => ({
    ...prop,
    image: prop.mainImage 
      ? urlFor(prop.mainImage).width(200).format('webp').url() 
      : '/PLACEHOLDER.jpg'
  }));

  return {
    allProperties
  };
}
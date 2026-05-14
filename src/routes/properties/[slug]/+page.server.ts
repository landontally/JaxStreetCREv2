import { client } from '$lib/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
const query = `
    *[_type == "property" && slug.current == $slug][0] {
      title,
      location,
      type,
      status,
      description,
      highlights,
      coordinates,
      surroundingArea,
      "image": mainImage.asset->url,
      "gallery": gallery[].asset->url,
      "brochureUrl": brochure.asset->url
    }
  `;

  const property = await client.fetch(query, { slug: params.slug });

  if (!property) {
    error(404, { message: 'Property not found' });
  }

  return {
    property
  };
}
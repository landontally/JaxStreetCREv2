import { client, urlFor } from '$lib/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  // Fetch the mainImage and gallery objects
  const query = `
      *[_type == "property" && slug.current == $slug][0] {
        title,
        location,
        status,
        squareFootage,
        "type": type->title,
        description,
        highlights,
        tenants,
        brochureUrl,
        mainImage,
        gallery,
        coordinates,
        surroundingArea
      }
    `;

  const rawProperty = await client.fetch(query, { slug: params.slug });

  if (!rawProperty) {
    throw error(404, 'Property not found');
  }

  // Optimize the images before sending them to the Svelte page
  const property = {
    ...rawProperty,
    // 1600px width is perfect for a crisp hero background
    image: rawProperty.mainImage ? urlFor(rawProperty.mainImage).width(1600).format('webp').url() : '/PLACEHOLDER.jpg',
    // Optimize every image in the gallery array to 1200px width
    gallery: rawProperty.gallery ? rawProperty.gallery.map((img: any) => urlFor(img).width(1200).format('webp').url()) : []
  };

  return { property };
}
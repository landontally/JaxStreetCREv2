import { client } from '$lib/sanity';

export async function load() {
const propertiesQuery = `
    *[_type == "property" && featured == true] | order(_createdAt desc)[0...5] {
      title,
      location,
      type,
      status,
      tenants, // <-- Added this!
      "image": mainImage.asset->url,
      "slug": slug.current
    }
  `;

  const heroQuery = `
    *[_type == "homePage"][0] {
      "images": heroImages[].asset->url
    }
  `;

  // Fetch both sets of data
  const [properties, homePageData] = await Promise.all([
    client.fetch(propertiesQuery),
    client.fetch(heroQuery)
  ]);

  // Our default fallback images
  const fallbackImages = [
    "https://images.unsplash.com/photo-1635627408391-8e82ac2c3b35?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
  ];

  // Safely check if homePageData exists, and if it has an images array with items. 
  // If not, send the fallbacks.
  const safeHeroImages = (homePageData && homePageData.images && homePageData.images.length > 0) 
    ? homePageData.images 
    : fallbackImages;

  return {
    // Guarantee properties is an array
    properties: properties || [],
    heroImages: safeHeroImages
  };
}
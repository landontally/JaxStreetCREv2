import { client, urlFor } from '$lib/sanity';

export async function load() {
  // 1. Fetch the raw mainImage object instead of the resolved URL
const propertiesQuery = `
    *[_type == "property" && featured == true] | order(_createdAt desc)[0...5] {
      title,
      location,
      "type": type->title,
      status,
      squareFootage, 
      tenants,
      mainImage,
      "slug": slug.current
    }
  `;

  // 2. Fetch the raw heroImages array
  const heroQuery = `
    *[_type == "homePage"][0] {
      heroImages // <-- Ask for the raw array here
    }
  `;

  // Fetch both sets of data
  const [rawProperties, homePageData] = await Promise.all([
    client.fetch(propertiesQuery),
    client.fetch(heroQuery)
  ]);

  // 3. Optimize property images (800px width for the carousel cards)
  const properties = (rawProperties || []).map((prop: any) => ({
    ...prop,
    image: prop.mainImage 
      ? urlFor(prop.mainImage).width(800).format('webp').url() 
      : '/PLACEHOLDER.jpg'
  }));

  // 4. Optimize homepage hero images (1600px width for the fullscreen background)
  let optimizedHeroImages = [];
  if (homePageData && homePageData.heroImages && homePageData.heroImages.length > 0) {
    optimizedHeroImages = homePageData.heroImages.map((img: any) => 
      urlFor(img).width(1600).format('webp').url()
    );
  }

  // Our default fallback images
  const fallbackImages = [
    "https://images.unsplash.com/photo-1635627408391-8e82ac2c3b35?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
  ];

  // Safely check if we successfully generated optimized hero images. 
  // If not, send the fallbacks.
  const safeHeroImages = optimizedHeroImages.length > 0 
    ? optimizedHeroImages 
    : fallbackImages;

  return {
    properties,
    heroImages: safeHeroImages
  };
}
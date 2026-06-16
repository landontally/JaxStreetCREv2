import { client, urlFor } from '$lib/sanity';

export async function load() {
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

  const heroQuery = `
    *[_type == "homePage"][0] {
      heroImages // <-- Ask for the raw array here
    }
  `;

  const [rawProperties, homePageData] = await Promise.all([
    client.fetch(propertiesQuery),
    client.fetch(heroQuery)
  ]);

  const properties = (rawProperties || []).map((prop: any) => ({
    ...prop,
    image: prop.mainImage 
      ? urlFor(prop.mainImage).width(800).format('webp').url() 
      : '/PLACEHOLDER.jpg'
  }));

  let optimizedHeroImages = [];
  if (homePageData && homePageData.heroImages && homePageData.heroImages.length > 0) {
    optimizedHeroImages = homePageData.heroImages.map((img: any) => 
      urlFor(img).width(1600).format('webp').url()
    );
  }

  const fallbackImages = [
    "https://images.unsplash.com/photo-1635627408391-8e82ac2c3b35?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
  ];

  const safeHeroImages = optimizedHeroImages.length > 0 
    ? optimizedHeroImages 
    : fallbackImages;

  return {
    properties,
    heroImages: safeHeroImages
  };
}
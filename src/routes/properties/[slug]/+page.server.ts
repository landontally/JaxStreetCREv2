import { client, urlFor } from '$lib/sanity';
import { error } from '@sveltejs/kit';

// The Haversine Formula: Calculates actual miles between two GPS coordinates
function getDistanceInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999; 
  const R = 3958.8; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function load({ params }) {
// 1. Fetch the Target Property
  const query = `
      *[_type == "property" && slug.current == $slug][0] {
        title, 
        location, 
        status, 
        squareFootage, 
        demographics, // <-- ADD THIS LINE!
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

  if (!rawProperty) throw error(404, { message: 'Property not found' });

  // 2. DEFENSIVE STATUS CHECK
  const currentStatus = rawProperty.status || '';
  
  // Safely check if it is Leased, otherwise match the exact status (e.g. Available)
  const statusFilter = currentStatus.toLowerCase().includes('leased')
      ? '(status == "Leased" || status == "100% Leased" || status == "leased")' 
      : `status == "${currentStatus}"`;
  
  const recQuery = `
      *[_type == "property" && slug.current != $slug && ${statusFilter}] {
        title, location, status, "type": type->title, mainImage, "slug": slug.current, coordinates
      }
  `;
  const rawRecommendations = await client.fetch(recQuery, { slug: params.slug });

  // 3. Sort recommendations by Geographic Distance
  const targetLat = rawProperty.coordinates?.lat;
  const targetLng = rawProperty.coordinates?.lng;

  let recommendations = (rawRecommendations || []).map((rec: any) => {
      const distance = getDistanceInMiles(targetLat, targetLng, rec.coordinates?.lat, rec.coordinates?.lng);
      return {
          ...rec,
          distance,
          image: rec.mainImage ? urlFor(rec.mainImage).width(600).format('webp').url() : '/PLACEHOLDER.jpg'
      };
  });

  // Sort by closest distance, then slice the top 3
  recommendations = recommendations.sort((a: any, b: any) => a.distance - b.distance).slice(0, 3);

  const property = {
    ...rawProperty,
    image: rawProperty.mainImage ? urlFor(rawProperty.mainImage).width(1600).format('webp').url() : '/PLACEHOLDER.jpg',
    gallery: rawProperty.gallery ? rawProperty.gallery.map((img: any) => urlFor(img).width(1200).format('webp').url()) : []
  };

  return { property, recommendations };
}
import { client } from '$lib/sanity';

export async function GET() {
    // 1. Fetch all current property slugs and their last updated date from Sanity
    const query = `*[_type == "property"]{ "slug": slug.current, _updatedAt }`;
    const properties = await client.fetch(query);

    const website = 'https://jaxstreetcre.com';

    // 2. Build the XML string dynamically
    const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${website}/</loc>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${website}/about</loc>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${website}/properties/available</loc>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${website}/properties/leased</loc>
        <priority>0.8</priority>
    </url>
    ${properties.map((prop: any) => `
    <url>
        <loc>${website}/properties/${prop.slug}</loc>
        <lastmod>${prop._updatedAt.split('T')[0]}</lastmod>
        <priority>0.7</priority>
    </url>
    `).join('')}
</urlset>`;

    // 3. Return it as an official XML Response
    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            // Cache it for an hour so we don't spam Sanity with API calls
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}
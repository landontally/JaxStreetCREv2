import { client } from '$lib/sanity';

export async function GET() {
    const query = `*[_type == "property"]{ "slug": slug.current, _updatedAt }`;
    const properties = await client.fetch(query);

    const website = 'https://jaxstreetcre.com';

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

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}
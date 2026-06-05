import { client, urlFor } from '$lib/sanity';

export async function load() {
    const query = `
        *[_type == "aboutPage"][0] {
            ...,
            heroImage
        }
    `;

    const rawPage = await client.fetch(query);

    if (!rawPage) {
        return { aboutPage: {} };
    }

    const aboutPageData = {
        ...rawPage,
        heroImage: rawPage.heroImage 
            ? urlFor(rawPage.heroImage).width(1600).format('webp').url() 
            : null
    };

    return { aboutPage: aboutPageData };
}
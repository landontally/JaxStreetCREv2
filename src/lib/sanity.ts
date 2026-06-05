import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 'smzr73s0', // Keep your current ID
    dataset: 'real-data',        // Keep your current dataset
    apiVersion: '2026-06-05',
    useCdn: true
});

// --- NEW CODE BELOW ---
// Initialize the builder and export the helper function
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
    return builder.image(source);
}
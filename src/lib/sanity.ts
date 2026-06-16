import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 'smzr73s0', 
    dataset: 'real-data',        
    apiVersion: '2026-06-05',
    useCdn: true
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
    return builder.image(source);
}
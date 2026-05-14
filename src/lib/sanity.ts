import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'smzr73s0', // We will replace this!
  dataset: 'production',
  apiVersion: '2024-05-13', // Today's date is fine for the API version
  useCdn: true // `true` makes it load faster for users
});
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal identifier for the studio.',
      initialValue: 'Homepage Settings',
      readOnly: true, // Prevents Eric from accidentally changing the title
    }),
    defineField({
      name: 'heroImages',
      title: 'Hero Background Images',
      type: 'array',
      description: 'Upload the images that will crossfade in the background of the homepage hero section.',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
})
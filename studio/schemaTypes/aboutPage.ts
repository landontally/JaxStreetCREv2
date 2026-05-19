import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal identifier for the studio.',
      initialValue: 'About Page Settings',
      readOnly: true, 
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'The large background image at the top of the About page.',
      options: { hotspot: true },
    }),
  ],
})
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'propertyType',
  title: 'Property Type',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Type Name',
      type: 'string',
      description: 'e.g., Retail, Office, Industrial',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
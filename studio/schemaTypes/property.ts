import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Property Name / Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location (City, State)',
      type: 'string',
      description: 'e.g., Bloomington, IN',
    }),
    defineField({
      name: 'type',
      title: 'Property Type',
      type: 'string',
      options: {
        list: [
          { title: 'Retail', value: 'Retail' },
          { title: 'Industrial', value: 'Industrial' },
          { title: 'Office', value: 'Office' },
          { title: 'Mixed Use', value: 'Mixed Use' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Leasing Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available', value: 'Available' },
          { title: '100% Leased', value: '100% Leased' },
          { title: 'Under Contract', value: 'Under Contract' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Card Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Property Description',
      type: 'text',
      description: 'The main story/details about the space.',
    }),
    defineField({
      name: 'highlights',
      title: 'Property Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points (e.g., High daily traffic count)',
    }),
    defineField({
      name: 'brochure',
      title: 'Brochure (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'coordinates',
      title: 'Main Property Coordinates',
      type: 'object',
      description: 'Right-click the property on Google Maps and copy the Latitude/Longitude.',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitude (e.g., 39.1653)' },
        { name: 'lng', type: 'number', title: 'Longitude (e.g., -86.5264)' }
      ]
    }),
    defineField({
      name: 'surroundingArea',
      title: 'Surrounding Area Highlights (Marquee & Map)',
      type: 'array',
      description: 'Add businesses here to populate the scrolling marquee and the interactive map markers.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Business Name (e.g., Target)' },
            { name: 'lat', type: 'number', title: 'Latitude' },
            { name: 'lng', type: 'number', title: 'Longitude' }
          ]
        }
      ]
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
})
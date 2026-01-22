import {defineField, defineType} from 'sanity'

export const familyType = defineType({
  name: 'family',
  title: 'Family',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    // Keeping imageUrl for backward compatibility or if used as string url directly
    defineField({
      name: 'imageUrl',
      type: 'string', 
      hidden: true
    }),
  ],
})

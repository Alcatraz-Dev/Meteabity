import {defineField, defineType} from 'sanity'

export const socialLinkType = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'url',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      type: 'string', 
    }),
  ],
})

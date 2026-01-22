import {defineField, defineType} from 'sanity'

export const commentType = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      type: 'text',
    }),
    defineField({
        name: 'author',
        type: 'string',
    }),
    defineField({
      name: 'dateISO',
      type: 'datetime',
    }),
    defineField({
      name: 'item',
      type: 'reference',
      to: [
        {type: 'swedenNews'},
        {type: 'usaNews'},
        {type: 'germanyNews'},
        {type: 'eritreaNews'}
      ],
    }),
    // Redundant fields to satisfy frontend queries if needed, 
    // but better to rely on 'item' reference. 
    // However, existing error suggests unknown fields were sent.
    // Let's add them as string/hidden if we want to allow them, 
    // OR update the frontend to NOT send them.
    // Based on error: itemId "n8FhBWize2lYvXeNffVXsW" and itemType "event"
    // The frontend sends these. We should probably just fix the frontend 
    // to correctly format the 'item' reference instead of sending raw IDs.
    // But adding them here is the quick schema fix.
    defineField({
        name: 'itemId',
        type: 'string',
        hidden: true
    }),
    defineField({
        name: 'itemType',
        type: 'string',
        hidden: true
    }),
     defineField({
        name: 'reactions',
        type: 'object',
        fields: [
            defineField({name: 'like', type: 'number', initialValue: 0}),
            defineField({name: 'smile', type: 'number', initialValue: 0}),
            defineField({name: 'heart', type: 'number', initialValue: 0}),
            defineField({name: 'celebrate', type: 'number', initialValue: 0}),
        ]
    })
  ],
})

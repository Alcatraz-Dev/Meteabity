import {defineField, defineType} from 'sanity'

export const newsType = defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'dateISO',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      type: 'string',
    }),
    defineField({
      name: 'kind',
      type: 'string',
      options: {
        list: [
          {title: 'Sweden', value: 'Sweden'},
          {title: 'USA', value: 'USA'},
          {title: 'Germany', value: 'Germany'},
          {title: 'Eritrea', value: 'Eritrea'},
          {title: 'Other', value: 'Other'},
        ],
      },
    }),
    defineField({
      name: 'notes',
      type: 'text',
    }),
    defineField({
      name: 'media',
      type: 'object',
      fields: [
        defineField({name: 'type', type: 'string', options: {list: ['image', 'video']}}),
        defineField({name: 'url', type: 'string'}),
        defineField({name: 'alt', type: 'string'}),
        defineField({name: 'posterUrl', type: 'string'}),
      ]
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

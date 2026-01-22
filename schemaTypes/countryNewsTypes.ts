import {defineField, defineType} from 'sanity'

export const newsFields = [
  defineField({
    name: 'title',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'dateISO',
    type: 'date',
    title: 'Date',
    validation: (Rule) => Rule.required(),
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
        {title: 'Birthday', value: 'Birthday'},
        {title: 'Reunion', value: 'Reunion'},
        {title: 'Holiday', value: 'Holiday'},
        {title: 'Other', value: 'Other'},
      ],
    },
    initialValue: 'Other',
  }),
  defineField({
    name: 'notes',
    type: 'text',
  }),
  defineField({
    name: 'media',
    type: 'object',
    fields: [
      {name: 'url', type: 'string'},
      {name: 'type', type: 'string', options: {list: ['image', 'video']}},
      {name: 'alt', type: 'string'},
    ],
  }),
  defineField({
    name: 'reactions',
    type: 'object',
    fields: [
      {name: 'like', type: 'number', initialValue: 0},
      {name: 'smile', type: 'number', initialValue: 0},
      {name: 'heart', type: 'number', initialValue: 0},
      {name: 'celebrate', type: 'number', initialValue: 0},
    ],
  }),
]

export const swedenNewsType = defineType({
  name: 'swedenNews',
  title: 'Sweden News',
  type: 'document',
  fields: newsFields,
})

export const usaNewsType = defineType({
  name: 'usaNews',
  title: 'USA News',
  type: 'document',
  fields: newsFields,
})

export const germanyNewsType = defineType({
  name: 'germanyNews',
  title: 'Germany News',
  type: 'document',
  fields: newsFields,
})

export const eritreaNewsType = defineType({
  name: 'eritreaNews',
  title: 'Eritrea News',
  type: 'document',
  fields: newsFields,
})

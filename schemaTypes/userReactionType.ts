import {defineField, defineType} from 'sanity'

export const userReactionType = defineType({
  name: 'userReaction',
  title: 'User Reaction',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      type: 'string',
    }),
    defineField({
        name: 'reactionType',
        type: 'string',
        options: {
            list: ['like', 'smile', 'heart', 'celebrate']
        }
    }),
    defineField({
      name: 'item',
      type: 'reference',
      to: [
        {type: 'swedenNews'},
        {type: 'usaNews'},
        {type: 'germanyNews'},
        {type: 'eritreaNews'},
        {type: 'comment'}
      ],
    }),
  ],
})

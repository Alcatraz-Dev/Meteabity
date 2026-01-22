import {defineField, defineType} from 'sanity'

export const familyNodeType = defineType({
  name: 'familyNode',
  title: 'Family Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'family',
      type: 'reference',
      to: [{type: 'family'}],
      weak: true,
    }),
    defineField({
      name: 'imageUrl',
      type: 'string',
    }),
    defineField({
      name: 'birthYear',
      type: 'number',
    }),
    defineField({
      name: 'note',
      type: 'text',
    }),
    defineField({
      name: 'parent',
      type: 'reference',
      to: [{type: 'familyNode'}],
      weak: true,
      description: 'The parent of this node (generic)'
    }),
    defineField({
      name: 'father',
      type: 'reference',
      to: [{type: 'familyNode'}],
      weak: true,
    }),
    defineField({
      name: 'mother',
      type: 'reference',
      to: [{type: 'familyNode'}],
      weak: true,
    }),
    defineField({
      name: 'gender',
      type: 'string',
        options: {
            list: [
                {title: 'Male', value: 'male'},
                {title: 'Female', value: 'female'},
                {title: 'Other', value: 'other'}
            ]
        }
    }),
  ],
})

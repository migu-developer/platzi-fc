import { defineType } from 'sanity'

export const competition = defineType({
  name: 'competition',
  title: 'Competicion',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    {
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Liga', value: 'league' },
          { title: 'Copa', value: 'cup' },
          { title: 'Amistoso', value: 'friendly' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'country', title: 'Pais', type: 'string' },
    { name: 'region', title: 'Region', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'name', type: 'type', media: 'logo' },
    prepare({ title, type, media }) {
      return { title, subtitle: type, media }
    },
  },
})

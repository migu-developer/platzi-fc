import { defineType } from 'sanity'

export const team = defineType({
  name: 'team',
  title: 'Equipo',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    {
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Club Principal', value: 'main' },
          { title: 'Rival', value: 'rival' },
          { title: 'Cantera', value: 'academy' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'badge', title: 'Escudo', type: 'image', options: { hotspot: true } },
    { name: 'country', title: 'Pais', type: 'string', validation: (r) => r.required() },
    { name: 'city', title: 'Ciudad', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'name', type: 'type', media: 'badge' },
    prepare({ title, type, media }) {
      return { title, subtitle: type, media }
    },
  },
})

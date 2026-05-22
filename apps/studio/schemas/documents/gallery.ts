import { defineType } from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Galeria',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titulo', type: 'string', validation: (r) => r.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    },
    {
      name: 'items',
      title: 'Fotos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'relatedMatch',
      title: 'Partido Relacionado',
      type: 'reference',
      to: [{ type: 'match' }],
    },
    { name: 'date', title: 'Fecha', type: 'datetime' },
  ],
  preview: {
    select: { title: 'title', date: 'date' },
    prepare({ title, date }) {
      return { title, subtitle: date ? new Date(date).toLocaleDateString('es') : '' }
    },
  },
})

import { defineType } from 'sanity'

export const season = defineType({
  name: 'season',
  title: 'Temporada',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    { name: 'startDate', title: 'Fecha Inicio', type: 'date', validation: (r) => r.required() },
    { name: 'endDate', title: 'Fecha Fin', type: 'date', validation: (r) => r.required() },
    {
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: { list: ['active', 'archived'] },
      initialValue: 'active',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'name', status: 'status' },
    prepare({ title, status }) {
      return { title, subtitle: status }
    },
  },
})

import { defineType } from 'sanity'

export const clubHistory = defineType({
  name: 'clubHistory',
  title: 'Historial de Clubes',
  type: 'object',
  fields: [
    { name: 'clubName', title: 'Club', type: 'string', validation: (r) => r.required() },
    { name: 'from', title: 'Desde', type: 'string' },
    { name: 'to', title: 'Hasta', type: 'string' },
  ],
})

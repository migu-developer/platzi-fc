import { defineType } from 'sanity'

export const venue = defineType({
  name: 'venue',
  title: 'Estadio',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    { name: 'address', title: 'Direccion', type: 'string' },
    { name: 'city', title: 'Ciudad', type: 'string' },
    { name: 'country', title: 'Pais', type: 'string' },
    { name: 'capacity', title: 'Capacidad', type: 'number' },
    { name: 'mapEmbedRef', title: 'Embed de Mapa', type: 'text', rows: 3 },
    { name: 'accessibility', title: 'Accesibilidad', type: 'array', of: [{ type: 'block' }] },
    { name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'city', media: 'photo' },
  },
})

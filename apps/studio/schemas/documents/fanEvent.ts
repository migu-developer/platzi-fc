import { defineType } from 'sanity'

export const fanEvent = defineType({
  name: 'fanEvent',
  title: 'Evento de Fans',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    { name: 'datetime', title: 'Fecha y Hora', type: 'datetime', validation: (r) => r.required() },
    { name: 'location', title: 'Lugar', type: 'string' },
    {
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: { list: ['meetup', 'watch_party', 'signing', 'tour', 'other'] },
    },
    { name: 'description', title: 'Descripcion', type: 'array', of: [{ type: 'block' }] },
    { name: 'registrationUrl', title: 'URL de Registro', type: 'url' },
    { name: 'capacity', title: 'Capacidad', type: 'number' },
    { name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true } },
  ],
  preview: {
    select: { title: 'name', date: 'datetime', media: 'image' },
    prepare({ title, date, media }) {
      return { title, subtitle: date ? new Date(date).toLocaleDateString('es') : '', media }
    },
  },
})

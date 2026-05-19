import { defineType } from 'sanity'

export const player = defineType({
  name: 'player',
  title: 'Jugador',
  type: 'document',
  fields: [
    { name: 'firstName', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    { name: 'lastName', title: 'Apellido', type: 'string', validation: (r) => r.required() },
    { name: 'number', title: 'Dorsal', type: 'number' },
    {
      name: 'position',
      title: 'Posicion',
      type: 'string',
      options: {
        list: [
          { title: 'Portero', value: 'goalkeeper' },
          { title: 'Defensa', value: 'defender' },
          { title: 'Centrocampista', value: 'midfielder' },
          { title: 'Delantero', value: 'forward' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'dateOfBirth', title: 'Fecha de Nacimiento', type: 'date' },
    { name: 'nationality', title: 'Nacionalidad', type: 'string' },
    { name: 'height', title: 'Altura (cm)', type: 'number' },
    { name: 'weight', title: 'Peso (kg)', type: 'number' },
    {
      name: 'foot',
      title: 'Pie Habil',
      type: 'string',
      options: { list: ['left', 'right', 'both'] },
    },
    { name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } },
    { name: 'bio', title: 'Biografia', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Activo', value: 'active' },
          { title: 'Lesionado', value: 'injured' },
          { title: 'Cedido', value: 'loaned' },
        ],
      },
      initialValue: 'active',
    },
    { name: 'team', title: 'Equipo', type: 'reference', to: [{ type: 'team' }] },
    { name: 'clubHistory', title: 'Historial de Clubes', type: 'array', of: [{ type: 'clubHistory' }] },
    {
      name: 'statsBySeason',
      title: 'Estadisticas por Temporada',
      type: 'array',
      of: [{ type: 'seasonStats' }],
    },
    { name: 'socialLinks', title: 'Redes Sociales', type: 'array', of: [{ type: 'socialLink' }] },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: (doc: Record<string, unknown>) => `${doc.firstName}-${doc.lastName}` },
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      number: 'number',
      position: 'position',
      media: 'photo',
    },
    prepare({ firstName, lastName, number, position, media }) {
      return {
        title: `#${number || '?'} ${firstName} ${lastName}`,
        subtitle: position,
        media,
      }
    },
  },
})

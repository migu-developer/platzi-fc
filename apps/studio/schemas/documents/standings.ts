import { defineType } from 'sanity'

export const standings = defineType({
  name: 'standings',
  title: 'Clasificacion',
  type: 'document',
  fields: [
    {
      name: 'season',
      title: 'Temporada',
      type: 'reference',
      to: [{ type: 'season' }],
      validation: (r) => r.required(),
    },
    {
      name: 'competition',
      title: 'Competicion',
      type: 'reference',
      to: [{ type: 'competition' }],
      validation: (r) => r.required(),
    },
    { name: 'rows', title: 'Filas', type: 'array', of: [{ type: 'standingRow' }] },
  ],
  preview: {
    select: { season: 'season.name', competition: 'competition.name' },
    prepare({ season, competition }) {
      return { title: `${competition || ''} — ${season || ''}` }
    },
  },
})

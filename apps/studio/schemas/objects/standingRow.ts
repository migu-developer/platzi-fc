import { defineType } from 'sanity'

export const standingRow = defineType({
  name: 'standingRow',
  title: 'Fila de Clasificacion',
  type: 'object',
  fields: [
    {
      name: 'team',
      title: 'Equipo',
      type: 'reference',
      to: [{ type: 'team' }],
      validation: (r) => r.required(),
    },
    { name: 'played', title: 'PJ', type: 'number', initialValue: 0 },
    { name: 'won', title: 'PG', type: 'number', initialValue: 0 },
    { name: 'drawn', title: 'PE', type: 'number', initialValue: 0 },
    { name: 'lost', title: 'PP', type: 'number', initialValue: 0 },
    { name: 'goalsFor', title: 'GF', type: 'number', initialValue: 0 },
    { name: 'goalsAgainst', title: 'GC', type: 'number', initialValue: 0 },
    { name: 'goalDifference', title: 'DG', type: 'number', initialValue: 0 },
    { name: 'points', title: 'Pts', type: 'number', initialValue: 0 },
    {
      name: 'form',
      title: 'Forma',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['W', 'D', 'L'] },
    },
  ],
  preview: {
    select: { teamName: 'team.name', points: 'points' },
    prepare({ teamName, points }) {
      return { title: teamName || 'Equipo', subtitle: `${points || 0} pts` }
    },
  },
})

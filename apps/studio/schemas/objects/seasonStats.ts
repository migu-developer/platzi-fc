import { defineType } from 'sanity'

export const seasonStats = defineType({
  name: 'seasonStats',
  title: 'Estadisticas por Temporada',
  type: 'object',
  fields: [
    {
      name: 'season',
      title: 'Temporada',
      type: 'reference',
      to: [{ type: 'season' }],
      validation: (r) => r.required(),
    },
    { name: 'competition', title: 'Competicion', type: 'reference', to: [{ type: 'competition' }] },
    { name: 'appearances', title: 'Partidos', type: 'number', initialValue: 0 },
    { name: 'goals', title: 'Goles', type: 'number', initialValue: 0 },
    { name: 'assists', title: 'Asistencias', type: 'number', initialValue: 0 },
    { name: 'yellowCards', title: 'Tarjetas Amarillas', type: 'number', initialValue: 0 },
    { name: 'redCards', title: 'Tarjetas Rojas', type: 'number', initialValue: 0 },
    { name: 'minutesPlayed', title: 'Minutos Jugados', type: 'number', initialValue: 0 },
  ],
})

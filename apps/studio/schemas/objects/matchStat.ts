import { defineType } from 'sanity'

export const matchStat = defineType({
  name: 'matchStat',
  title: 'Estadistica del Partido',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Estadistica',
      type: 'string',
      options: {
        list: [
          { title: 'Posesion (%)', value: 'Posesion' },
          { title: 'Tiros totales', value: 'Tiros totales' },
          { title: 'Tiros a puerta', value: 'Tiros a puerta' },
          { title: 'Corners', value: 'Corners' },
          { title: 'Faltas', value: 'Faltas' },
          { title: 'Fueras de juego', value: 'Fueras de juego' },
          { title: 'Tarjetas amarillas', value: 'Tarjetas amarillas' },
          { title: 'Tarjetas rojas', value: 'Tarjetas rojas' },
          { title: 'Pases completados', value: 'Pases completados' },
          { title: 'Precision de pase (%)', value: 'Precision de pase' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'home', title: 'Local', type: 'number', validation: (r) => r.required().min(0) },
    { name: 'away', title: 'Visitante', type: 'number', validation: (r) => r.required().min(0) },
  ],
  preview: {
    select: { label: 'label', home: 'home', away: 'away' },
    prepare({ label, home, away }) {
      return { title: `${label}: ${home ?? '?'} - ${away ?? '?'}` }
    },
  },
})

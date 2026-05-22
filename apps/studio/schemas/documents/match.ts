import { defineType } from 'sanity'

export const match = defineType({
  name: 'match',
  title: 'Partido',
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
    { name: 'matchday', title: 'Jornada', type: 'number' },
    {
      name: 'datetime',
      title: 'Fecha y Hora',
      type: 'datetime',
      validation: (r) => r.required(),
    },
    { name: 'venue', title: 'Estadio', type: 'reference', to: [{ type: 'venue' }] },
    {
      name: 'homeTeam',
      title: 'Equipo Local',
      type: 'reference',
      to: [{ type: 'team' }],
      validation: (r) => r.required(),
    },
    {
      name: 'awayTeam',
      title: 'Equipo Visitante',
      type: 'reference',
      to: [{ type: 'team' }],
      validation: (r) => r.required(),
    },
    {
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Programado', value: 'scheduled' },
          { title: 'En Vivo', value: 'live' },
          { title: 'Finalizado', value: 'finished' },
          { title: 'Suspendido', value: 'suspended' },
        ],
      },
      initialValue: 'scheduled',
    },
    { name: 'homeScore', title: 'Goles Local', type: 'number' },
    { name: 'awayScore', title: 'Goles Visitante', type: 'number' },
    { name: 'attendance', title: 'Asistencia', type: 'number' },
    { name: 'referee', title: 'Arbitro', type: 'string' },
    {
      name: 'homeLineup',
      title: 'Alineacion Local',
      type: 'array',
      of: [{ type: 'lineupEntry' }],
    },
    {
      name: 'awayLineup',
      title: 'Alineacion Visitante',
      type: 'array',
      of: [{ type: 'lineupEntry' }],
    },
    { name: 'events', title: 'Eventos', type: 'array', of: [{ type: 'matchEvent' }] },
    { name: 'stats', title: 'Estadisticas', type: 'array', of: [{ type: 'matchStat' }] },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: Record<string, unknown>) => {
          const datetime = doc.datetime as string | undefined
          return datetime ? `partido-${datetime.slice(0, 10)}` : 'partido'
        },
      },
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: {
      home: 'homeTeam.name',
      away: 'awayTeam.name',
      homeScore: 'homeScore',
      awayScore: 'awayScore',
      date: 'datetime',
    },
    prepare({ home, away, homeScore, awayScore, date }) {
      const score = homeScore != null && awayScore != null ? `${homeScore} - ${awayScore}` : 'vs'
      const d = date ? new Date(date).toLocaleDateString('es') : ''
      return { title: `${home || '?'} ${score} ${away || '?'}`, subtitle: d }
    },
  },
})

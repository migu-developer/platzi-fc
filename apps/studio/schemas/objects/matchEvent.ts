import { defineType } from 'sanity'

export const matchEvent = defineType({
  name: 'matchEvent',
  title: 'Evento de Partido',
  type: 'object',
  fields: [
    { name: 'minute', title: 'Minuto', type: 'number', validation: (r) => r.required().min(0) },
    {
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Gol', value: 'goal' },
          { title: 'Asistencia', value: 'assist' },
          { title: 'Tarjeta Amarilla', value: 'yellow_card' },
          { title: 'Tarjeta Roja', value: 'red_card' },
          { title: 'Sustitucion', value: 'substitution' },
          { title: 'VAR', value: 'var' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'player', title: 'Jugador', type: 'reference', to: [{ type: 'player' }] },
    { name: 'playerIn', title: 'Jugador Entra', type: 'reference', to: [{ type: 'player' }] },
    { name: 'description', title: 'Descripcion', type: 'string' },
  ],
  preview: {
    select: { minute: 'minute', type: 'type', playerName: 'player.firstName' },
    prepare({ minute, type, playerName }) {
      return { title: `${minute}' — ${type}`, subtitle: playerName }
    },
  },
})

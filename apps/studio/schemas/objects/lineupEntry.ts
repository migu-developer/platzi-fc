import { defineType } from 'sanity'

export const lineupEntry = defineType({
  name: 'lineupEntry',
  title: 'Jugador en Alineacion',
  type: 'object',
  fields: [
    {
      name: 'player',
      title: 'Jugador',
      type: 'reference',
      to: [{ type: 'player' }],
      validation: (r) => r.required(),
    },
    { name: 'position', title: 'Posicion', type: 'string' },
    { name: 'number', title: 'Dorsal', type: 'number' },
    { name: 'starter', title: 'Titular', type: 'boolean', initialValue: true },
  ],
  preview: {
    select: { name: 'player.firstName', lastName: 'player.lastName', number: 'number' },
    prepare({ name, lastName, number }) {
      return { title: `#${number || '?'} ${name || ''} ${lastName || ''}` }
    },
  },
})

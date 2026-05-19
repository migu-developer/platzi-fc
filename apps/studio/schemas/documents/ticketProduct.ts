import { defineType } from 'sanity'

export const ticketProduct = defineType({
  name: 'ticketProduct',
  title: 'Producto de Entrada',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    {
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Partido', value: 'match' },
          { title: 'Abono', value: 'season_pass' },
          { title: 'Membresia', value: 'membership' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'match', title: 'Partido', type: 'reference', to: [{ type: 'match' }] },
    { name: 'season', title: 'Temporada', type: 'reference', to: [{ type: 'season' }] },
    { name: 'description', title: 'Descripcion', type: 'array', of: [{ type: 'block' }] },
    { name: 'checkoutUrl', title: 'URL de Compra', type: 'url', validation: (r) => r.required() },
    { name: 'zones', title: 'Zonas', type: 'array', of: [{ type: 'string' }] },
    { name: 'policies', title: 'Politicas', type: 'array', of: [{ type: 'block' }] },
  ],
  preview: {
    select: { title: 'name', type: 'type' },
    prepare({ title, type }) {
      return { title, subtitle: type }
    },
  },
})

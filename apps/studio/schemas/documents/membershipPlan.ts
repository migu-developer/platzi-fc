import { defineType } from 'sanity'

export const membershipPlan = defineType({
  name: 'membershipPlan',
  title: 'Plan de Membresia',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    { name: 'level', title: 'Nivel', type: 'string' },
    { name: 'benefits', title: 'Beneficios', type: 'array', of: [{ type: 'block' }] },
    { name: 'priceRef', title: 'Precio Referencia', type: 'string' },
    { name: 'checkoutUrl', title: 'URL de Compra', type: 'url' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'level' },
  },
})

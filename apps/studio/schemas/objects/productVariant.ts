import { defineType } from 'sanity'

export const productVariant = defineType({
  name: 'productVariant',
  title: 'Variante de Producto',
  type: 'object',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    { name: 'sku', title: 'SKU', type: 'string' },
    { name: 'price', title: 'Precio', type: 'number', validation: (r) => r.required().min(0) },
    { name: 'currency', title: 'Moneda', type: 'string', initialValue: 'EUR' },
    { name: 'available', title: 'Disponible', type: 'boolean', initialValue: true },
  ],
})

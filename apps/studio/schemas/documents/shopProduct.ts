import { defineType } from 'sanity'

export const shopProduct = defineType({
  name: 'shopProduct',
  title: 'Producto de Tienda',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: { list: ['camisetas', 'ropa', 'accesorios', 'coleccionables'] },
    },
    { name: 'description', title: 'Descripcion', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'images',
      title: 'Imagenes',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    { name: 'variants', title: 'Variantes', type: 'array', of: [{ type: 'productVariant' }] },
    { name: 'checkoutUrl', title: 'URL de Compra', type: 'url' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } },
    { name: 'relatedPlayer', title: 'Jugador Relacionado', type: 'reference', to: [{ type: 'player' }] },
  ],
  preview: {
    select: { title: 'name', category: 'category', media: 'images.0' },
    prepare({ title, category, media }) {
      return { title, subtitle: category, media }
    },
  },
})

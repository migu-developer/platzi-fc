import { defineType } from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Noticia',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titulo', type: 'string', validation: (r) => r.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    },
    { name: 'publishedAt', title: 'Fecha de Publicacion', type: 'datetime' },
    { name: 'author', title: 'Autor', type: 'string' },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: ['club', 'equipo', 'academia', 'femenino', 'comunidad', 'tienda'],
      },
    },
    {
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    { name: 'excerpt', title: 'Extracto', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'body',
      title: 'Cuerpo',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      validation: (r) => r.required(),
    },
    { name: 'featuredImage', title: 'Imagen Destacada', type: 'image', options: { hotspot: true } },
    {
      name: 'relatedArticles',
      title: 'Articulos Relacionados',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    },
    { name: 'seo', title: 'SEO', type: 'seo' },
    {
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: { list: ['draft', 'published'] },
      initialValue: 'draft',
    },
    { name: 'official', title: 'Comunicado Oficial', type: 'boolean', initialValue: false },
    {
      name: 'attachments',
      title: 'Archivos Adjuntos',
      type: 'array',
      of: [{ type: 'file' }],
      hidden: ({ parent }: { parent: Record<string, unknown> }) => !parent?.official,
    },
  ],
  preview: {
    select: { title: 'title', date: 'publishedAt', media: 'featuredImage', status: 'status' },
    prepare({ title, date, media, status }) {
      const d = date ? new Date(date).toLocaleDateString('es') : ''
      return { title, subtitle: `${status} — ${d}`, media }
    },
  },
  orderings: [
    {
      title: 'Fecha de Publicacion',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})

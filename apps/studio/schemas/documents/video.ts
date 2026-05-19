import { defineType } from 'sanity'

export const video = defineType({
  name: 'video',
  title: 'Video',
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
    { name: 'platform', title: 'Plataforma', type: 'string', options: { list: ['youtube', 'vimeo', 'mux'] } },
    { name: 'embedRef', title: 'ID / URL del Video', type: 'string' },
    { name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true } },
    { name: 'categories', title: 'Categorias', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } },
    { name: 'date', title: 'Fecha', type: 'datetime' },
    { name: 'relatedMatch', title: 'Partido Relacionado', type: 'reference', to: [{ type: 'match' }] },
  ],
  preview: {
    select: { title: 'title', date: 'date', media: 'thumbnail' },
    prepare({ title, date, media }) {
      return { title, subtitle: date ? new Date(date).toLocaleDateString('es') : '', media }
    },
  },
})

import { defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Pagina',
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
    {
      name: 'section',
      title: 'Seccion',
      type: 'string',
      options: {
        list: [
          { title: 'Club — Historia', value: 'club-historia' },
          { title: 'Club — Identidad', value: 'club-identidad' },
          { title: 'Club — Estadio', value: 'club-estadio' },
          { title: 'Club — Fundacion', value: 'club-fundacion' },
          { title: 'Club — Transparencia', value: 'club-transparencia' },
          { title: 'Club — Contacto', value: 'club-contacto' },
          { title: 'Legal — Terminos', value: 'legal-terminos' },
          { title: 'Legal — Privacidad', value: 'legal-privacidad' },
          { title: 'Legal — Accesibilidad', value: 'legal-accesibilidad' },
          { title: 'Fans', value: 'fans' },
          { title: 'Academia', value: 'academia' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'subtitle', title: 'Subtitulo', type: 'string' },
    { name: 'featuredImage', title: 'Imagen Destacada', type: 'image', options: { hotspot: true } },
    {
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    },
    { name: 'seo', title: 'SEO', type: 'seo' },
  ],
  preview: {
    select: { title: 'title', section: 'section' },
    prepare({ title, section }) {
      return { title, subtitle: section }
    },
  },
})

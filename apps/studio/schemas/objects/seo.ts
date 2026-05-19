import { defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    { name: 'title', title: 'Meta Title', type: 'string' },
    { name: 'description', title: 'Meta Description', type: 'text', rows: 3 },
    { name: 'canonical', title: 'Canonical URL', type: 'url' },
  ],
})

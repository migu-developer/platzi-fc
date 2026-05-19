import { defineType } from 'sanity'

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    {
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Principal', value: 'main' },
          { title: 'Oficial', value: 'official' },
          { title: 'Partner', value: 'partner' },
          { title: 'Proveedor', value: 'supplier' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } },
    { name: 'url', title: 'Web', type: 'url' },
    { name: 'activeFrom', title: 'Vigencia Desde', type: 'date' },
    { name: 'activeTo', title: 'Vigencia Hasta', type: 'date' },
    { name: 'activations', title: 'Activaciones', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'name', tier: 'tier', media: 'logo' },
    prepare({ title, tier, media }) {
      return { title, subtitle: tier, media }
    },
  },
})

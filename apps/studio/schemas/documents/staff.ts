import { defineType } from 'sanity'

export const staff = defineType({
  name: 'staff',
  title: 'Staff',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() },
    { name: 'role', title: 'Rol', type: 'string', validation: (r) => r.required() },
    { name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } },
    { name: 'bio', title: 'Biografia', type: 'array', of: [{ type: 'block' }] },
    { name: 'team', title: 'Equipo', type: 'reference', to: [{ type: 'team' }] },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})

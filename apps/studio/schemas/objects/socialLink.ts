import { defineType } from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Red Social',
  type: 'object',
  fields: [
    {
      name: 'platform',
      title: 'Plataforma',
      type: 'string',
      options: {
        list: ['instagram', 'twitter', 'facebook', 'tiktok', 'youtube', 'linkedin'],
      },
    },
    { name: 'url', title: 'URL', type: 'url' },
  ],
})

import { defineType } from 'sanity'

export const videoCategory = defineType({
  name: 'videoCategory',
  title: 'Categoria de Video',
  type: 'object',
  fields: [
    {
      name: 'value',
      title: 'Valor',
      type: 'string',
      options: {
        list: [
          { title: 'Highlights', value: 'highlights' },
          { title: 'Conferencias', value: 'conferencias' },
          { title: 'Entrenamientos', value: 'entrenamientos' },
          { title: 'Entrevistas', value: 'entrevistas' },
          { title: 'Institucional', value: 'institucional' },
        ],
      },
    },
  ],
})

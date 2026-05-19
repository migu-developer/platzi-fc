import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Platzi FC — Sitio Oficial',
    short_name: 'Platzi FC',
    description: 'Sitio oficial de Platzi FC. Noticias, partidos, entradas, tienda y mas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F5F0',
    theme_color: '#1B4332',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}

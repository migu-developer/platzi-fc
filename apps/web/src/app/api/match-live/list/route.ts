import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

const LIVE_MATCHES_QUERY = groq`
  *[_type == "match" && status == "live"] {
    _id, status, homeScore, awayScore, slug,
    "homeTeam": homeTeam-> { name },
    "awayTeam": awayTeam-> { name }
  }
`

export async function GET() {
  try {
    const matches = await client.fetch(LIVE_MATCHES_QUERY, {}, { cache: 'no-store' })

    return NextResponse.json(matches ?? [], {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error al obtener partidos en vivo', error: String(err) },
      { status: 500 },
    )
  }
}

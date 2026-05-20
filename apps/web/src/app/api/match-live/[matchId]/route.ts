import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

const LIVE_MATCH_QUERY = groq`
  *[_type == "match" && _id == $matchId][0] {
    _id, status, homeScore, awayScore,
    events[] { minute, type, player-> { firstName, lastName }, playerIn-> { firstName, lastName }, description },
    stats[] { label, home, away },
    "homeTeam": homeTeam-> { name },
    "awayTeam": awayTeam-> { name }
  }
`

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> },
) {
  try {
    const { matchId } = await params

    const match = await client.fetch(LIVE_MATCH_QUERY, { matchId }, { cache: 'no-store' })

    if (!match) {
      return NextResponse.json({ message: 'Partido no encontrado' }, { status: 404 })
    }

    return NextResponse.json(match, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error al obtener datos del partido', error: String(err) },
      { status: 500 },
    )
  }
}

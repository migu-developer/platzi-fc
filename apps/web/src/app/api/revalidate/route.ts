import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Revalidation endpoint for Sanity webhooks.
 *
 * Configure a GROQ-powered webhook in Sanity that POSTs to this route
 * whenever content changes. The payload should include:
 *   - `_type`: the document type that changed
 *   - `slug`: (optional) the document slug
 *
 * Set SANITY_REVALIDATE_SECRET in your environment and send it as
 * `?secret=<value>` or in the `x-sanity-secret` header.
 */
export async function POST(request: NextRequest) {
  try {
    const secret =
      request.nextUrl.searchParams.get('secret') ??
      request.headers.get('x-sanity-secret')

    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Token invalido' }, { status: 401 })
    }

    const body = await request.json()
    const { _type, slug } = body as { _type?: string; slug?: string }

    if (!_type) {
      return NextResponse.json(
        { message: 'Falta el campo _type en el body' },
        { status: 400 },
      )
    }

    // Revalidate the document type tag (e.g. "match", "player", "article")
    revalidateTag(_type)

    // If a slug is provided, also revalidate the specific document
    if (slug) {
      revalidateTag(`${_type}:${slug}`)
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
      slug: slug ?? null,
    })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error al procesar la solicitud de revalidacion', error: String(err) },
      { status: 500 },
    )
  }
}

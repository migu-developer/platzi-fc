import NextAuth, { type NextAuthResult } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Using credentials provider as a placeholder
// In production, replace with Email (magic link) provider + database adapter
const nextAuth: NextAuthResult = NextAuth({
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'tu@email.com' },
      },
      async authorize(credentials) {
        // TODO: Replace with actual email verification + database lookup
        if (credentials?.email) {
          return {
            id: '1',
            email: credentials.email as string,
            name: (credentials.email as string).split('@')[0],
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
})

export const handlers: NextAuthResult['handlers'] = nextAuth.handlers
export const signIn: NextAuthResult['signIn'] = nextAuth.signIn
export const signOut: NextAuthResult['signOut'] = nextAuth.signOut
export const auth: NextAuthResult['auth'] = nextAuth.auth

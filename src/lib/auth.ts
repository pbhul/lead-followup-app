import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo credentials for development
        if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
          try {
            // Try to find existing user
            let user = await prisma.user.findUnique({
              where: {
                email: credentials.email
              }
            })

            // If user doesn't exist, create them
            if (!user) {
              user = await prisma.user.create({
                data: {
                  email: credentials.email,
                  name: 'Demo User',
                  role: 'AGENT',
                }
              })
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          } catch (error) {
            console.error('Database error during auth:', error)
            // Fallback: return demo user without database
            return {
              id: 'demo-user-id',
              email: credentials.email,
              name: 'Demo User',
              role: 'AGENT' as const,
            }
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: user.role,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
        }
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}
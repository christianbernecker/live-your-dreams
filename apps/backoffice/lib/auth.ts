import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Für Development: Hardcoded Admin User
          if (
            credentials.email === 'admin@liveyourdreams.de' && 
            credentials.password === 'lyd-admin-2024'
          ) {
            return {
              id: '1',
              email: 'admin@liveyourdreams.de',
              name: 'LYD Administrator',
              role: 'ADMIN'
            };
          }

          // TODO: Später durch echte Datenbank-Abfrage ersetzen
          // const user = await db.user.findUnique({
          //   where: { email: credentials.email }
          // });
          // 
          // if (!user || !await bcrypt.compare(credentials.password, user.hashedPassword)) {
          //   return null;
          // }
          // 
          // return {
          //   id: user.id,
          //   email: user.email,
          //   name: user.name,
          //   role: user.role
          // };

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'lyd-dev-secret-2024'
};
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Für zukünftige Prisma-Integration vorbereitet
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "@/lib/prisma"

export const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { 
          label: "E-Mail", 
          type: "email",
          placeholder: "ihre@email.de" 
        },
        password: { 
          label: "Passwort", 
          type: "password" 
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // TODO: Später durch echte Datenbankabfrage ersetzen
        // Temporäre Demo-User für Entwicklung
        const demoUser = {
          id: "1",
          email: "admin@liveyourdreams.online",
          password: await bcrypt.hash("admin123", 12), // Gehasht für Sicherheit
          name: "LYD Admin",
          role: "admin"
        }

        // E-Mail prüfen
        if (credentials.email !== demoUser.email) {
          throw new Error("Ungültige E-Mail-Adresse")
        }

        // Passwort prüfen - VEREINFACHT FÜR DEMO
        // const isValidPassword = await bcrypt.compare(
        //   credentials.password as string, 
        //   demoUser.password
        // )
        
        // Temporär: Direct string comparison für Demo
        const isValidPassword = credentials.password === "admin123"

        if (!isValidPassword) {
          console.log("❌ Passwort-Fehler:", credentials.password)
          throw new Error("Ungültiges Passwort")
        }
        
        console.log("✅ Login erfolgreich für:", credentials.email)

        // Erfolgreiche Authentifizierung
        return {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/", // Login-Seite ist die Startseite
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Tage
  },
  // adapter: PrismaAdapter(prisma), // Für zukünftige Datenbankintegration
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)

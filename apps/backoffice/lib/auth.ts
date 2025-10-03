import bcrypt from "bcryptjs"
import { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
      isActive: boolean
      permissions: string[]
    }
  }

  interface User {
    role: string
    isActive: boolean
    permissions: string[]
  }
}

// JWT token type handled by NextAuth automatically

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('🔑 JWT CALLBACK - User from authorize():', {
          id: user.id,
          email: user.email,
          role: (user as any).role,
          permissions: (user as any).permissions
        });
        
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.role = (user as any).role
        token.isActive = (user as any).isActive
        token.permissions = (user as any).permissions
        
        console.log('🎫 JWT TOKEN after assignment:', {
          role: token.role,
          permissions: token.permissions
        });
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        console.log('📋 SESSION CALLBACK - Token data:', {
          role: (token as any).role,
          permissions: (token as any).permissions,
          permissionsType: typeof (token as any).permissions
        });
        
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        session.user.role = (token as any).role
        session.user.isActive = (token as any).isActive
        session.user.permissions = (token as any).permissions
        
        // KRITISCHER FALLBACK: Wenn permissions undefined, aber Admin-Email
        if (!session.user.permissions && session.user.email === 'admin@liveyourdreams.online') {
          console.warn('⚠️ SESSION FALLBACK: No permissions from token, using email-based admin fallback');
          session.user.role = 'admin';
          session.user.permissions = [
            'users.read', 'users.write', 'users.delete', 'users.invite',
            'roles.read', 'roles.write', 'roles.assign',
            'content.read', 'content.write', 'content.publish',
            'media.read', 'media.write', 'media.delete',
            'settings.read', 'settings.write', 'settings.system',
            'audit.read'
          ];
        }
        
        console.log('✅ SESSION after assignment:', {
          email: session.user.email,
          role: session.user.role,
          permissions: session.user.permissions,
          permissionsCount: session.user.permissions?.length || 0
        });
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnAuth = nextUrl.pathname.startsWith('/auth')
      
      // Protected routes: dashboard und admin
      if (isOnDashboard || isOnAdmin) {
        if (!isLoggedIn) {
          return false // Redirect to login
        }
        
        // Check if user is active
        if (!auth.user.isActive) {
          return Response.redirect(new URL('/auth/error?error=AccountDeactivated', nextUrl))
        }
        
        // Admin-Routen: Prüfe admin Role
        if (isOnAdmin) {
          const isAdmin = auth.user.role === 'admin'
          if (!isAdmin) {
            return Response.redirect(new URL('/dashboard', nextUrl))
          }
        }
        
        return true
      }
      
      // Login-Seite: Redirect eingeloggte User zu Dashboard
      if (nextUrl.pathname === '/' && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      
      // Alle anderen Routen erlauben
      return true
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email und Passwort sind erforderlich')
        }

        try {
          // Initialize Prisma Client for server-side usage
          const { PrismaClient } = await import('@prisma/client')
          const prisma = new PrismaClient()

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { 
              email: credentials.email as string 
            }
          })

          if (!user) {
            throw new Error('Kein Benutzer mit dieser E-Mail-Adresse gefunden')
          }

          // Check if user is active 
          const isActive = (user as any).isActive
          if (!isActive) {
            throw new Error('Ihr Konto wurde deaktiviert. Kontaktieren Sie den Administrator.')
          }

          // Verify password
          if (!user.password) {
            throw new Error('Kein Passwort für diesen Benutzer hinterlegt')
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error('Ungültiges Passwort')
          }

          // Note: lastLoginAt update skipped for deployment compatibility

          // Load user roles and permissions from RBAC system with error handling
          let permissions: string[] = [];
          let primaryRole = 'viewer'; // Default role

          console.log('🔐 AUTHORIZE() - Loading permissions for:', user.email);

          try {
            // Simplified query - step by step to avoid complex joins
            const userRoles = await prisma.userRole.findMany({
              where: { userId: user.id },
              include: {
                role: true
              }
            });

            console.log('📊 AUTHORIZE() - Found user roles:', userRoles.length);

            if (userRoles.length > 0) {
              // Set primary role (admin takes precedence)
              for (const userRole of userRoles) {
                console.log('🔍 AUTHORIZE() - Checking role:', {
                  roleName: userRole.role.name,
                  isActive: userRole.role.isActive
                });
                
                if (userRole.role.isActive) {
                  if (userRole.role.name === 'admin') {
                    primaryRole = 'admin';
                  } else if (userRole.role.name === 'editor' && primaryRole !== 'admin') {
                    primaryRole = 'editor';
                  } else if (userRole.role.name === 'author' && primaryRole === 'viewer') {
                    primaryRole = 'author';
                  }
                }
              }

              console.log('✅ AUTHORIZE() - Primary role determined:', primaryRole);

              // For admin role, give full permissions (fallback)
              if (primaryRole === 'admin') {
                permissions = [
                  'users.read', 'users.write', 'users.delete', 'users.invite',
                  'roles.read', 'roles.write', 'roles.assign',
                  'content.read', 'content.write', 'content.publish',
                  'media.read', 'media.write', 'media.delete',
                  'settings.read', 'settings.write', 'settings.system',
                  'audit.read'
                ];
              } else if (primaryRole === 'editor') {
                permissions = [
                  'users.read', 'content.read', 'content.write', 'content.publish',
                  'media.read', 'media.write', 'settings.read'
                ];
              } else {
                permissions = ['content.read', 'media.read', 'settings.read'];
              }
              
              console.log('🎯 AUTHORIZE() - Permissions assigned:', permissions.length);
            } else {
              console.warn('⚠️ AUTHORIZE() - No user roles found for user');
            }
          } catch (roleError) {
            console.error('❌ AUTHORIZE() - Error loading user roles:', roleError);
            // Fallback: if role loading fails, check if this is admin user
            if (user.email === 'admin@liveyourdreams.online') {
              console.log('🆘 AUTHORIZE() - Using email fallback for admin');
              primaryRole = 'admin';
              permissions = [
                'users.read', 'users.write', 'users.delete', 'users.invite',
                'roles.read', 'roles.write', 'roles.assign',
                'content.read', 'content.write', 'content.publish',
                'settings.read', 'settings.write', 'settings.system',
                'audit.read'
              ];
            }
          }

          // Cleanup
          await prisma.$disconnect()

          console.log('🚀 AUTHORIZE() - Returning user object:', {
            id: user.id,
            email: user.email,
            role: primaryRole,
            permissionsCount: permissions.length,
            permissions: permissions.slice(0, 3) // First 3 for brevity
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: primaryRole,
            isActive: isActive,
            permissions: permissions.sort(),
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default authConfig
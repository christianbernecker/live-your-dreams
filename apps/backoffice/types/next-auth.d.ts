import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: 'ADMIN' | 'USER';
    };
  }

  interface User {
    role: 'ADMIN' | 'USER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'ADMIN' | 'USER';
  }
}

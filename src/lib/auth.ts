import 'server-only';
import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL ?? 'login@mjolne.co';

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Using JWT sessions because there is no database adapter wired in v1.
  // TODO(persistence): when Postgres lands, switch to a Drizzle / Prisma adapter
  // so we can persist users + magic-link tokens correctly.
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    verifyRequest: '/login?check=1',
  },
  providers: apiKey
    ? [
        Resend({
          apiKey,
          from,
        }),
      ]
    : [],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email;
      }
      return session;
    },
  },
});

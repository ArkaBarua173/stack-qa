import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      id: string; //Added the 'id' property here
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials, req) {
        const { email, password } = credentials as any;

        const user = await prisma.user.findFirst({ where: { email } });

        if (!user) {
          throw new Error("No user found with email. Please Sign up");
        }

        const checkPassword = await compare(password, user.password as string);

        if (!checkPassword || user.email !== email) {
          throw new Error("Username or Password doesn't match");
        }

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      const existingProfile = await prisma.profile.findFirst({
        where: { userId: user?.id },
      });
      if (!existingProfile) {
        await prisma.profile.create({
          data: {
            bio: "Bio for " + user?.name,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: user.id,
          },
        });
      }
      if (user?.id && user?.name) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token, user }) {
      const existingProfile = await prisma.profile.findFirst({
        where: { userId: user?.id },
      });
      if (!existingProfile) {
        await prisma.profile.create({
          data: {
            bio: "Bio for " + user?.name,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: user.id,
          },
        });
      }
      session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

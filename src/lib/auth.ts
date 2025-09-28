import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { role } from 'better-auth/plugins';
import { openAPI, admin, organization  } from "better-auth/plugins"


const prisma = new PrismaClient();

export const auth: any = betterAuth({
  trustedOrigins: ['http://localhost:3001'],
  plugins: [
    openAPI(),
    admin(),
    organization(),
  ],
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:{
    google:{
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
    },
  },
});

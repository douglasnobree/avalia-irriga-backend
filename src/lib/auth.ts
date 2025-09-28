import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const prisma = new PrismaClient();


export const auth = betterAuth({
  database: {
    adapter: prismaAdapter(prisma, {
      provider: 'mysql',
    }),
  },
});

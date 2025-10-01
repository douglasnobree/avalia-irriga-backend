import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { role } from 'better-auth/plugins';
import { openAPI, admin, organization  } from "better-auth/plugins"
import { EmailService } from '../infra/email/email.service';


const prisma = new PrismaClient();
const emailService = new EmailService();

export const auth: any = betterAuth({
  trustedOrigins: ['http://localhost:3001', 'http://localhost:3000'],
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
    sendResetPassword: async ({ user, url, token }, request) => {
      await emailService.sendResetPasswordEmail(user.email, url, token);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await emailService.sendVerificationEmail(user.email, url, token);
    },
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

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (passwordsMatch) {
          const WHITELIST_EMAILS = [
            "anne.liangco@whitecloak.com",
            "donn.gamboa@whitecloak.com",
            "miguel.fermin@whitecloak.com",
            "thea.juego@whitecloak.com",
            "cherubim.citco@whitecloak.com"
          ];

          if (WHITELIST_EMAILS.includes(email.toLowerCase())) {
            // Check & Create Patient record
            const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
            if (!patient) {
              await prisma.patient.create({ data: { userId: user.id } });
            }

            // Check & Create Doctor record
            const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
            if (!doctor) {
              const licenseNumber = `WC-${Math.floor(100000 + Math.random() * 900000)}`;
              await prisma.doctor.create({
                data: {
                  userId: user.id,
                  specialization: "General Medicine",
                  licenseNumber,
                  experienceYears: 5,
                  consultFee: 500.00
                }
              });
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});

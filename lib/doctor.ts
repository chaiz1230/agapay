import { prisma } from "@/lib/db";

export async function getDoctorOrProvision(userId: string, email: string) {
  // First attempt to find existing doctor record
  let doctor = await prisma.doctor.findUnique({
    where: { userId },
    include: { user: true }
  });

  // If missing, check if they are whitelisted and auto-create the profile
  if (!doctor) {
    const WHITELIST_EMAILS = [
      "anne.liangco@whitecloak.com",
      "donn.gamboa@whitecloak.com",
      "miguel.fermin@whitecloak.com",
      "thea.juego@whitecloak.com",
      "cherubim.citco@whitecloak.com"
    ];
    if (email && WHITELIST_EMAILS.includes(email.toLowerCase())) {
      const licenseNumber = `WC-${Math.floor(100000 + Math.random() * 900000)}`;
      doctor = await prisma.doctor.create({
        data: {
          userId,
          specialization: "General Medicine",
          licenseNumber,
          experienceYears: 5,
          consultFee: 500.00
        },
        include: { user: true }
      });
    }
  }

  return doctor;
}

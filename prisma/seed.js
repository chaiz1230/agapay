const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

  // Wipe data in reverse dependency order
  console.log("Clearing existing data...");
  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = bcrypt.hashSync("Password123", 10);

  // 1. Seed Patient
  console.log("Seeding patient...");
  const patientUser = await prisma.user.create({
    data: {
      email: "patient@agapay.com",
      name: "Jane Doe",
      passwordHash,
      role: "PATIENT",
    },
  });

  const patientProfile = await prisma.patient.create({
    data: {
      id: "1a8f9b2c-3d4e-5f6g-7h8i-9j0k1l2m3n4o", // align with frontend mock id
      userId: patientUser.id,
      dateOfBirth: new Date("1995-05-15T00:00:00.000Z"),
      gender: "Female",
      bloodType: "A+",
      phone: "09123456789",
      address: "Manila, Philippines",
    },
  });

  // 2. Seed Doctors
  console.log("Seeding doctors...");
  const doctorsData = [
    {
      email: "elena.santos@agapay.com",
      name: "Elena Santos",
      specialization: "Cardiology",
      licenseNumber: "PRC-CARD-9912",
      bio: "Specializing in invasive and preventive cardiology with a patient-centric, empathetic healthcare framework. Over 12 years of clinical research.",
      experienceYears: 12,
      consultFee: 1500.0,
    },
    {
      email: "sofia.chen@agapay.com",
      name: "Sofia Chen",
      specialization: "Pediatrics",
      licenseNumber: "PRC-PEDI-3321",
      bio: "Dedicated pediatrician providing comprehensive developmental healthcare, pediatric growth tracking, and adolescent consultations.",
      experienceYears: 8,
      consultFee: 800.0,
    },
    {
      email: "marco.rivera@agapay.com",
      name: "Marco Rivera",
      specialization: "Dermatology",
      licenseNumber: "PRC-DERM-4456",
      bio: "Board-certified dermatologist focusing on medical dermatosurgery, inflammatory skin conditions, and clinical skincare treatments.",
      experienceYears: 10,
      consultFee: 1200.0,
    },
    {
      email: "julian.reyes@agapay.com",
      name: "Julian Reyes",
      specialization: "Neurology",
      licenseNumber: "PRC-NEUR-7788",
      bio: "Clinical neurologist specializing in cognitive disorders, persistent migraine management, and peripheral nerve assessments.",
      experienceYears: 15,
      consultFee: 2000.0,
    },
    {
      email: "arthur.cruz@agapay.com",
      name: "Arthur Cruz",
      specialization: "Pulmonology",
      licenseNumber: "PRC-PULM-1122",
      bio: "Board-certified pulmonologist focused on bronchial asthma, chronic respiratory health, and sleep apnea studies.",
      experienceYears: 11,
      consultFee: 1300.0,
    },
    {
      email: "teresa.gomez@agapay.com",
      name: "Teresa Gomez",
      specialization: "Psychiatry",
      licenseNumber: "PRC-PSYC-8877",
      bio: "Clinical psychiatrist specializing in cognitive therapy, adolescent anxiety relief, and persistent stress management.",
      experienceYears: 9,
      consultFee: 1000.0,
    },
  ];

  for (const doc of doctorsData) {
    const docUser = await prisma.user.create({
      data: {
        email: doc.email,
        name: doc.name,
        passwordHash,
        role: "DOCTOR",
      },
    });

    await prisma.doctor.create({
      data: {
        userId: docUser.id,
        specialization: doc.specialization,
        licenseNumber: doc.licenseNumber,
        bio: doc.bio,
        experienceYears: doc.experienceYears,
        consultFee: doc.consultFee,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

"use server";

import { prisma } from "@/lib/db";

export async function getSpecialistDoctors(query?: string, specialization?: string) {
  try {
    const whereClause: any = {};

    if (specialization && specialization !== "All Specialists") {
      whereClause.specialization = {
        equals: specialization,
        mode: "insensitive",
      };
    }

    if (query) {
      whereClause.OR = [
        {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          specialization: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          bio: {
            contains: query,
            mode: "insensitive",
          },
        },
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        experienceYears: "desc",
      },
    });

    const serializedDoctors = doctors.map(doc => ({
      ...doc,
      consultFee: Number(doc.consultFee),
    }));

    return { success: true, doctors: serializedDoctors };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch doctors" };
  }
}

export async function getRecommendedSpecialists(symptoms: string) {
  try {
    const symptomMap: { [key: string]: string } = {
      cough: "Pulmonology",
      "shortness of breath": "Pulmonology",
      asthma: "Pulmonology",
      rash: "Dermatology",
      skin: "Dermatology",
      acne: "Dermatology",
      headache: "Neurology",
      migraine: "Neurology",
      numbness: "Neurology",
      palpitations: "Cardiology",
      heart: "Cardiology",
      "chest pain": "Cardiology",
      anxiety: "Psychiatry",
      depression: "Psychiatry",
      stress: "Psychiatry",
      stomach: "Gastroenterology",
      gastric: "Gastroenterology",
      acid: "Gastroenterology",
      fever: "Pediatrics",
      flu: "Pediatrics",
      kid: "Pediatrics",
      child: "Pediatrics",
    };

    const lowercaseSymptoms = symptoms.toLowerCase();
    let detectedSpecialization = "General Practice";

    for (const [keyword, spec] of Object.entries(symptomMap)) {
      if (lowercaseSymptoms.includes(keyword)) {
        detectedSpecialization = spec;
        break;
      }
    }

    const doctors = await prisma.doctor.findMany({
      where: {
        specialization: {
          contains: detectedSpecialization,
          mode: "insensitive",
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      take: 4,
    });

    const serializedDoctors = doctors.map(doc => ({
      ...doc,
      consultFee: Number(doc.consultFee),
    }));

    return { success: true, specialization: detectedSpecialization, doctors: serializedDoctors };
  } catch (error: any) {
    return { error: error.message || "Failed to get AI recommendation" };
  }
}

export async function updateDoctorProfile(userId: string, data: { specialization: string; bio: string; consultFee: number }) {
  try {
    const doctor = await prisma.doctor.update({
      where: { userId },
      data: {
        specialization: data.specialization,
        bio: data.bio,
        consultFee: data.consultFee,
      },
    });
    return { 
      success: true, 
      doctor: {
        ...doctor,
        consultFee: Number(doctor.consultFee),
      } 
    };
  } catch (error: any) {
    return { error: error.message || "Failed to update profile" };
  }
}

"use server";

import { prisma } from "@/lib/db";
import { AppointmentStatus } from "@prisma/client";

export async function bookAppointment(data: {
  patientId: string;
  doctorId: string;
  dateTime: Date;
  notes?: string;
  cost: number;
}) {
  try {
    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        dateTime: data.dateTime,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
      },
    });

    if (existing) {
      return { error: "This timeslot is already booked. Please choose another." };
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        dateTime: data.dateTime,
        notes: data.notes,
        cost: data.cost,
        status: AppointmentStatus.PENDING,
      },
    });

    return { success: true, appointment };
  } catch (error: any) {
    return { error: error.message || "Failed to book appointment" };
  }
}

export async function approveAppointment(appointmentId: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CONFIRMED,
      },
    });
    return { success: true, appointment };
  } catch (error: any) {
    return { error: error.message || "Failed to approve appointment" };
  }
}

export async function cancelAppointment(appointmentId: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCELLED,
      },
    });
    return { success: true, appointment };
  } catch (error: any) {
    return { error: error.message || "Failed to cancel appointment" };
  }
}

export async function rescheduleAppointment(appointmentId: string, newDateTime: Date) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        dateTime: newDateTime,
        status: AppointmentStatus.PENDING,
      },
    });
    return { success: true, appointment };
  } catch (error: any) {
    return { error: error.message || "Failed to reschedule appointment" };
  }
}

export async function finalizeConsultation(data: {
  appointmentId: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.update({
        where: { id: data.appointmentId },
        data: {
          status: AppointmentStatus.COMPLETED,
          prescription: data.prescription,
        },
      });

      const record = await tx.medicalRecord.create({
        data: {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          notes: data.notes,
        },
      });

      return { appointment, record };
    });

    return { success: true, ...result };
  } catch (error: any) {
    return { error: error.message || "Failed to finalize consultation" };
  }
}

export async function getMedicalRecords(patientId: string) {
  try {
    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, records };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch medical records" };
  }
}

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
    // Backend validation: date/time must be in the future
    const now = new Date();
    if (new Date(data.dateTime).getTime() < now.getTime() - 60000) {
      return { error: "Cannot book an appointment in the past." };
    }
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

    // Fetch details to create notification for the doctor
    const doctor = await prisma.doctor.findUnique({
      where: { id: data.doctorId },
      select: { userId: true }
    });
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
      include: { user: { select: { name: true } } }
    });

    if (doctor && patient) {
      const formattedDate = new Date(data.dateTime).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      await prisma.notification.create({
        data: {
          userId: doctor.userId,
          message: `New appointment booked by ${patient.user.name} for ${formattedDate}.`,
          read: false,
        }
      });
    }

    return { 
      success: true, 
      appointment: {
        ...appointment,
        cost: Number(appointment.cost),
      } 
    };
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

    const detailedAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        patient: { select: { userId: true } }
      }
    });

    if (detailedAppointment) {
      await prisma.notification.create({
        data: {
          userId: detailedAppointment.patient.userId,
          message: `Your appointment with Dr. ${detailedAppointment.doctor.user.name} has been confirmed.`,
          read: false,
        }
      });
    }

    return { 
      success: true, 
      appointment: {
        ...appointment,
        cost: Number(appointment.cost),
      } 
    };
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

    const detailedAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        patient: { include: { user: { select: { name: true } } } }
      }
    });

    if (detailedAppointment) {
      await prisma.notification.create({
        data: {
          userId: detailedAppointment.patient.userId,
          message: `Your appointment with Dr. ${detailedAppointment.doctor.user.name} has been cancelled.`,
          read: false,
        }
      });

      await prisma.notification.create({
        data: {
          userId: detailedAppointment.doctor.userId,
          message: `The appointment with patient ${detailedAppointment.patient.user.name} has been cancelled.`,
          read: false,
        }
      });
    }

    return { 
      success: true, 
      appointment: {
        ...appointment,
        cost: Number(appointment.cost),
      } 
    };
  } catch (error: any) {
    return { error: error.message || "Failed to cancel appointment" };
  }
}

export async function rescheduleAppointment(appointmentId: string, newDateTime: Date) {
  try {
    // Backend validation: date/time must be in the future
    const now = new Date();
    if (new Date(newDateTime).getTime() < now.getTime() - 60000) {
      return { error: "Cannot reschedule an appointment to a date/time in the past." };
    }
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        dateTime: newDateTime,
        status: AppointmentStatus.PENDING,
      },
    });

    const detailedAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        patient: { include: { user: { select: { name: true } } } }
      }
    });

    if (detailedAppointment) {
      const formattedDate = new Date(newDateTime).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      await prisma.notification.create({
        data: {
          userId: detailedAppointment.patient.userId,
          message: `Your appointment with Dr. ${detailedAppointment.doctor.user.name} has been rescheduled to ${formattedDate}.`,
          read: false,
        }
      });

      await prisma.notification.create({
        data: {
          userId: detailedAppointment.doctor.userId,
          message: `The appointment with patient ${detailedAppointment.patient.user.name} has been rescheduled to ${formattedDate}.`,
          read: false,
        }
      });
    }

    return { 
      success: true, 
      appointment: {
        ...appointment,
        cost: Number(appointment.cost),
      } 
    };
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

    return { 
      success: true, 
      appointment: {
        ...result.appointment,
        cost: Number(result.appointment.cost),
      },
      record: result.record
    };
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

export async function getAppointmentDetails(appointmentId: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        patient: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      return { error: "Appointment not found" };
    }

    return {
      success: true,
      appointment: {
        ...appointment,
        cost: Number(appointment.cost),
        dateTime: appointment.dateTime.toISOString(),
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
        doctor: {
          ...appointment.doctor,
          consultFee: Number(appointment.doctor.consultFee),
        }
      },
    };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch appointment details" };
  }
}

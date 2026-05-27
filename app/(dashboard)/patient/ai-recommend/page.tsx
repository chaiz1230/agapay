import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import AiRecommendationClientPage from "./AiRecommendationClientPage";

export default async function AiRecommendationPage() {
  const session = await auth();

  if (!session || session.user.role !== "PATIENT") {
    redirect("/login");
  }

  // Verify user exists in DB first to handle stale/wiped sessions gracefully
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!dbUser) {
    redirect("/api/auth/clear-stale-session");
  }

  // Fetch patient profile (automatically create on-the-fly if missing to ensure navigability)
  let patient = await prisma.patient.findUnique({
    where: { userId: session.user.id }
  });

  if (!patient) {
    patient = await prisma.patient.create({
      data: { userId: session.user.id }
    });
  }

  return <AiRecommendationClientPage patientId={patient.id} />;
}

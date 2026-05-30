"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function createNotification(userId: string, message: string) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        read: false,
      },
    });
    return { success: true, notification };
  } catch (error: any) {
    console.error("Failed to create notification:", error);
    return { error: error.message || "Failed to create notification" };
  }
}

export async function getUnreadNotifications() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, notifications };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch notifications" };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: {
        read: true,
      },
    });
    return { success: true, notification };
  } catch (error: any) {
    return { error: error.message || "Failed to mark notification as read" };
  }
}

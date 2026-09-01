"use server";

import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function toggleUserStatusAction(userId: string, currentStatus: string) {
  try {
    const newStatus =
      currentStatus === "ACTIVE"
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: newStatus,
      },
    });

    revalidatePath("/");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error toggling user status in server action:", error);
    return { success: false, error: "Failed to update user status" };
  }
}

"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";

const batchSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  subject: z.string().trim().optional(),
  description: z.string().trim().optional(),
  monthlyFee: z.coerce.number().int().min(0, "Fee must be 0 or more"),
});

export type BatchInput = z.infer<typeof batchSchema>;

export async function createBatch(input: BatchInput) {
  await requireAdmin();
  const data = batchSchema.parse(input);
  await prisma.batch.create({ data });
  revalidatePath("/batches");
}

export async function updateBatch(id: string, input: BatchInput) {
  await requireAdmin();
  const data = batchSchema.parse(input);
  await prisma.batch.update({ where: { id }, data });
  revalidatePath("/batches");
  revalidatePath(`/batches/${id}`);
}

export async function setBatchActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.batch.update({ where: { id }, data: { active } });
  revalidatePath("/batches");
  revalidatePath(`/batches/${id}`);
}

export async function deleteBatch(id: string) {
  await requireAdmin();
  const enrollmentCount = await prisma.enrollment.count({ where: { batchId: id } });
  if (enrollmentCount > 0) {
    throw new Error(
      "Cannot delete a batch with enrolled students. Deactivate it instead.",
    );
  }
  await prisma.batch.delete({ where: { id } });
  revalidatePath("/batches");
}

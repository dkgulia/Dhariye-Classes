"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";

const recordPaymentSchema = z.object({
  studentId: z.string().min(1),
  batchId: z.string().min(1),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Invalid month"),
  amountDue: z.number().int().min(0),
  amountPaid: z.number().int().min(0),
  method: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

export async function recordPayment(input: RecordPaymentInput) {
  await requireAdmin();
  const data = recordPaymentSchema.parse(input);

  await prisma.feePayment.upsert({
    where: {
      studentId_batchId_month: {
        studentId: data.studentId,
        batchId: data.batchId,
        month: data.month,
      },
    },
    update: {
      amountDue: data.amountDue,
      amountPaid: data.amountPaid,
      method: data.method,
      notes: data.notes,
      paidAt: data.amountPaid > 0 ? new Date() : null,
    },
    create: {
      studentId: data.studentId,
      batchId: data.batchId,
      month: data.month,
      amountDue: data.amountDue,
      amountPaid: data.amountPaid,
      method: data.method,
      notes: data.notes,
      paidAt: data.amountPaid > 0 ? new Date() : null,
    },
  });

  revalidatePath("/fees");
  revalidatePath(`/fees/${data.studentId}`);
  revalidatePath(`/students/${data.studentId}`);
}

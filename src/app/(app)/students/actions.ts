"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";

const studentSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().optional(),
  guardianName: z.string().trim().optional(),
  guardianPhone: z.string().trim().optional(),
});

export type StudentInput = z.infer<typeof studentSchema>;

export async function createStudent(input: StudentInput) {
  await requireAdmin();
  const data = studentSchema.parse(input);
  const student = await prisma.student.create({ data });
  revalidatePath("/students");
  return student;
}

export async function updateStudent(id: string, input: StudentInput) {
  await requireAdmin();
  const data = studentSchema.parse(input);
  await prisma.student.update({ where: { id }, data });
  revalidatePath("/students");
  revalidatePath(`/students/${id}`);
}

export async function setStudentActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.student.update({ where: { id }, data: { active } });
  revalidatePath("/students");
  revalidatePath(`/students/${id}`);
}

export async function deleteStudent(id: string) {
  await requireAdmin();
  const enrollmentCount = await prisma.enrollment.count({ where: { studentId: id } });
  if (enrollmentCount > 0) {
    throw new Error(
      "Cannot delete a student with batch enrollments. Deactivate instead.",
    );
  }
  await prisma.student.delete({ where: { id } });
  revalidatePath("/students");
}

const enrollSchema = z.object({
  studentId: z.string().min(1),
  batchId: z.string().min(1, "Choose a batch"),
  feeOverride: z.number().int().min(0).optional(),
});

export type EnrollInput = z.infer<typeof enrollSchema>;

export async function enrollStudentInBatch(input: EnrollInput) {
  await requireAdmin();
  const data = enrollSchema.parse(input);

  const existing = await prisma.enrollment.findUnique({
    where: { studentId_batchId: { studentId: data.studentId, batchId: data.batchId } },
  });

  if (existing) {
    if (existing.active) {
      throw new Error("Student is already enrolled in this batch.");
    }
    await prisma.enrollment.update({
      where: { id: existing.id },
      data: { active: true, feeOverride: data.feeOverride },
    });
  } else {
    await prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        batchId: data.batchId,
        feeOverride: data.feeOverride,
      },
    });
  }

  revalidatePath(`/students/${data.studentId}`);
  revalidatePath(`/batches/${data.batchId}`);
}

export async function unenrollStudent(enrollmentId: string) {
  await requireAdmin();
  const enrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { active: false },
  });
  revalidatePath(`/students/${enrollment.studentId}`);
  revalidatePath(`/batches/${enrollment.batchId}`);
}

"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";

const saveAttendanceSchema = z.object({
  batchId: z.string().min(1),
  date: z.string().min(1),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(["PRESENT", "ABSENT", "LATE"]),
    }),
  ),
});

export type SaveAttendanceInput = z.infer<typeof saveAttendanceSchema>;

export async function saveAttendance(input: SaveAttendanceInput) {
  await requireAdmin();
  const data = saveAttendanceSchema.parse(input);
  const date = new Date(`${data.date}T00:00:00.000Z`);

  const session = await prisma.attendanceSession.upsert({
    where: { batchId_date: { batchId: data.batchId, date } },
    update: {},
    create: { batchId: data.batchId, date },
  });

  await prisma.$transaction(
    data.records.map((record) =>
      prisma.attendanceRecord.upsert({
        where: {
          sessionId_studentId: { sessionId: session.id, studentId: record.studentId },
        },
        update: { status: record.status },
        create: {
          sessionId: session.id,
          studentId: record.studentId,
          status: record.status,
        },
      }),
    ),
  );

  revalidatePath("/attendance");
  revalidatePath("/attendance/history");
}

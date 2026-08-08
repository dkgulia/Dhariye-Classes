import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AttendanceForm } from "./attendance-form";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AttendancePage({
  searchParams,
}: PageProps<"/attendance">) {
  const params = await searchParams;
  const batches = await prisma.batch.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const batchIdParam = typeof params.batchId === "string" ? params.batchId : "";
  const batchId = batches.some((b) => b.id === batchIdParam)
    ? batchIdParam
    : batches[0]?.id ?? "";
  const date = typeof params.date === "string" ? params.date : todayIso();

  let students: { id: string; name: string }[] = [];
  const initialStatuses: Record<string, "PRESENT" | "ABSENT" | "LATE"> = {};

  if (batchId) {
    const enrollments = await prisma.enrollment.findMany({
      where: { batchId, active: true },
      include: { student: true },
      orderBy: { student: { name: "asc" } },
    });
    students = enrollments.map((e) => ({ id: e.student.id, name: e.student.name }));

    const session = await prisma.attendanceSession.findUnique({
      where: { batchId_date: { batchId, date: new Date(`${date}T00:00:00.000Z`) } },
      include: { records: true },
    });
    if (session) {
      for (const record of session.records) {
        initialStatuses[record.studentId] = record.status;
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <Link href="/attendance/history" className="text-sm underline">
          View history
        </Link>
      </div>
      <AttendanceForm
        batches={batches}
        batchId={batchId}
        date={date}
        students={students}
        initialStatuses={initialStatuses}
      />
    </div>
  );
}

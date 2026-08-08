import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, BookOpen, Wallet, CircleDollarSign } from "lucide-react";

function currentMonthIso() {
  return new Date().toISOString().slice(0, 7);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const month = currentMonthIso();
  const today = todayIso();

  const [studentCount, batchCount, enrollments, payments, todaysSessions] =
    await Promise.all([
      prisma.student.count({ where: { active: true } }),
      prisma.batch.count({ where: { active: true } }),
      prisma.enrollment.findMany({
        where: { active: true, student: { active: true }, batch: { active: true } },
        include: { batch: true },
      }),
      prisma.feePayment.findMany({ where: { month } }),
      prisma.attendanceSession.findMany({
        where: { date: new Date(`${today}T00:00:00.000Z`) },
        include: { batch: true, records: true },
      }),
    ]);

  const paymentMap = new Map(payments.map((p) => [`${p.studentId}:${p.batchId}`, p]));

  let totalDue = 0;
  let totalPaid = 0;
  for (const enrollment of enrollments) {
    const payment = paymentMap.get(`${enrollment.studentId}:${enrollment.batchId}`);
    totalDue += payment?.amountDue ?? enrollment.feeOverride ?? enrollment.batch.monthlyFee;
    totalPaid += payment?.amountPaid ?? 0;
  }

  const stats = [
    {
      label: "Active students",
      value: studentCount,
      icon: Users,
      tone: "bg-secondary text-primary",
    },
    {
      label: "Active batches",
      value: batchCount,
      icon: BookOpen,
      tone: "bg-accent/50 text-accent-foreground",
    },
    {
      label: "Due this month",
      value: `₹${totalDue}`,
      icon: Wallet,
      tone: "bg-secondary text-primary",
    },
    {
      label: "Collected this month",
      value: `₹${totalPaid}`,
      icon: CircleDollarSign,
      tone: "bg-accent/50 text-accent-foreground",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Overview
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Today at Dhariye Classes
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <span
                className={`flex size-9 items-center justify-center rounded-xl ${stat.tone}`}
              >
                <stat.icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-semibold">
            Today&apos;s attendance
          </h2>
          <Link
            href="/attendance"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Mark attendance
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Late</TableHead>
                <TableHead>Absent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysSessions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No attendance marked yet today.
                  </TableCell>
                </TableRow>
              )}
              {todaysSessions.map((session) => {
                const present = session.records.filter(
                  (r) => r.status === "PRESENT",
                ).length;
                const late = session.records.filter(
                  (r) => r.status === "LATE",
                ).length;
                const absent = session.records.filter(
                  (r) => r.status === "ABSENT",
                ).length;
                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.batch.name}
                    </TableCell>
                    <TableCell>
                      <Badge>{present}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{late}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{absent}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

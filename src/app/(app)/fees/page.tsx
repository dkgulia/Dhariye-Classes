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
import { MonthPicker } from "./month-picker";
import { RecordPaymentButton } from "./record-payment-button";

function currentMonthIso() {
  return new Date().toISOString().slice(0, 7);
}

export default async function FeesPage({ searchParams }: PageProps<"/fees">) {
  const params = await searchParams;
  const month = typeof params.month === "string" ? params.month : currentMonthIso();

  const enrollments = await prisma.enrollment.findMany({
    where: { active: true, student: { active: true }, batch: { active: true } },
    include: { student: true, batch: true },
    orderBy: [{ batch: { name: "asc" } }, { student: { name: "asc" } }],
  });

  const payments = await prisma.feePayment.findMany({ where: { month } });
  const paymentMap = new Map(
    payments.map((p) => [`${p.studentId}:${p.batchId}`, p]),
  );

  const rows = enrollments.map((enrollment) => {
    const payment = paymentMap.get(`${enrollment.studentId}:${enrollment.batchId}`);
    const amountDue = payment?.amountDue ?? enrollment.feeOverride ?? enrollment.batch.monthlyFee;
    const amountPaid = payment?.amountPaid ?? 0;
    return { enrollment, payment, amountDue, amountPaid };
  });

  const totalDue = rows.reduce((sum, row) => sum + row.amountDue, 0);
  const totalPaid = rows.reduce((sum, row) => sum + row.amountPaid, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fees</h1>
        <MonthPicker month={month} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total due ({month})</p>
          <p className="text-2xl font-semibold">₹{totalDue}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total collected ({month})</p>
          <p className="text-2xl font-semibold">₹{totalPaid}</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No active enrollments.
              </TableCell>
            </TableRow>
          )}
          {rows.map(({ enrollment, payment, amountDue, amountPaid }) => {
            const status =
              amountPaid >= amountDue && amountDue > 0
                ? "Paid"
                : amountPaid > 0
                  ? "Partial"
                  : "Unpaid";
            return (
              <TableRow key={enrollment.id}>
                <TableCell>
                  <Link
                    href={`/fees/${enrollment.studentId}`}
                    className="font-medium hover:underline"
                  >
                    {enrollment.student.name}
                  </Link>
                </TableCell>
                <TableCell>{enrollment.batch.name}</TableCell>
                <TableCell>₹{amountDue}</TableCell>
                <TableCell>₹{amountPaid}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      status === "Paid"
                        ? "default"
                        : status === "Partial"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <RecordPaymentButton
                    studentId={enrollment.studentId}
                    batchId={enrollment.batchId}
                    month={month}
                    studentName={enrollment.student.name}
                    batchName={enrollment.batch.name}
                    defaultAmountDue={amountDue}
                    defaultAmountPaid={amountPaid}
                    defaultMethod={payment?.method ?? undefined}
                    defaultNotes={payment?.notes ?? undefined}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

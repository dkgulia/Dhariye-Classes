import { notFound } from "next/navigation";
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

export default async function StudentFeeLedgerPage({
  params,
}: PageProps<"/fees/[studentId]">) {
  const { studentId } = await params;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      feePayments: {
        include: { batch: true },
        orderBy: { month: "desc" },
      },
    },
  });

  if (!student) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{student.name} — Fee ledger</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Paid on</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {student.feePayments.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No fee records yet.
              </TableCell>
            </TableRow>
          )}
          {student.feePayments.map((payment) => {
            const status =
              payment.amountPaid >= payment.amountDue && payment.amountDue > 0
                ? "Paid"
                : payment.amountPaid > 0
                  ? "Partial"
                  : "Unpaid";
            return (
              <TableRow key={payment.id}>
                <TableCell>{payment.month}</TableCell>
                <TableCell>{payment.batch.name}</TableCell>
                <TableCell>₹{payment.amountDue}</TableCell>
                <TableCell>₹{payment.amountPaid}</TableCell>
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
                <TableCell>{payment.method ?? "—"}</TableCell>
                <TableCell>
                  {payment.paidAt ? payment.paidAt.toLocaleDateString() : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

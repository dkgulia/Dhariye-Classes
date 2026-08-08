import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditStudentButton } from "../edit-student-button";
import { EnrollButton } from "../enroll-button";
import { UnenrollButton } from "../unenroll-button";

export default async function StudentDetailPage({
  params,
}: PageProps<"/students/[id]">) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: { batch: true },
        orderBy: { joinedAt: "asc" },
      },
      attendanceRecords: {
        include: { session: { include: { batch: true } } },
        orderBy: { session: { date: "desc" } },
        take: 10,
      },
      feePayments: {
        include: { batch: true },
        orderBy: { month: "desc" },
        take: 6,
      },
    },
  });

  if (!student) notFound();

  const activeEnrollments = student.enrollments.filter((e) => e.active);
  const enrolledBatchIds = new Set(activeEnrollments.map((e) => e.batchId));

  const allActiveBatches = await prisma.batch.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  const availableBatches = allActiveBatches.filter((b) => !enrolledBatchIds.has(b.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{student.name}</h1>
          <p className="text-muted-foreground">{student.phone ?? "No phone on file"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={student.active ? "default" : "secondary"}>
            {student.active ? "Active" : "Inactive"}
          </Badge>
          <EditStudentButton student={student} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Guardian</CardTitle>
        </CardHeader>
        <CardContent>
          {student.guardianName || student.guardianPhone ? (
            <p>
              {student.guardianName ?? "—"}
              {student.guardianPhone ? ` · ${student.guardianPhone}` : ""}
            </p>
          ) : (
            <p className="text-muted-foreground">No guardian details on file</p>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Batches</h2>
          <EnrollButton studentId={student.id} availableBatches={availableBatches} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.enrollments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Not enrolled in any batch yet.
                </TableCell>
              </TableRow>
            )}
            {student.enrollments.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell>
                  <Link
                    href={`/batches/${enrollment.batchId}`}
                    className="font-medium hover:underline"
                  >
                    {enrollment.batch.name}
                  </Link>
                </TableCell>
                <TableCell>₹{enrollment.feeOverride ?? enrollment.batch.monthlyFee}</TableCell>
                <TableCell>{enrollment.joinedAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={enrollment.active ? "default" : "secondary"}>
                    {enrollment.active ? "Active" : "Ended"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {enrollment.active && <UnenrollButton enrollmentId={enrollment.id} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Recent attendance</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.attendanceRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No attendance recorded yet.
                </TableCell>
              </TableRow>
            )}
            {student.attendanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.session.date.toLocaleDateString()}</TableCell>
                <TableCell>{record.session.batch.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      record.status === "PRESENT"
                        ? "default"
                        : record.status === "LATE"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {record.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Fee ledger</h2>
          <Link href={`/fees/${student.id}`} className="text-sm underline">
            View full ledger
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.feePayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No fee records yet.
                </TableCell>
              </TableRow>
            )}
            {student.feePayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.month}</TableCell>
                <TableCell>{payment.batch.name}</TableCell>
                <TableCell>₹{payment.amountDue}</TableCell>
                <TableCell>₹{payment.amountPaid}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

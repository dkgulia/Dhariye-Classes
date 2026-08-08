import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NewStudentButton } from "./new-student-button";
import { StudentRowActions } from "./student-row-actions";

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        where: { active: true },
        include: { batch: true },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Students</h1>
        <NewStudentButton />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Batches</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No students yet. Add one to get started.
              </TableCell>
            </TableRow>
          )}
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <Link
                  href={`/students/${student.id}`}
                  className="font-medium hover:underline"
                >
                  {student.name}
                </Link>
              </TableCell>
              <TableCell>{student.phone ?? "—"}</TableCell>
              <TableCell>
                {student.enrollments.length === 0
                  ? "—"
                  : student.enrollments.map((e) => e.batch.name).join(", ")}
              </TableCell>
              <TableCell>
                <Badge variant={student.active ? "default" : "secondary"}>
                  {student.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <StudentRowActions student={student} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

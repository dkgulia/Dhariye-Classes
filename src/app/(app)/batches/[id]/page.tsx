import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default async function BatchDetailPage({
  params,
}: PageProps<"/batches/[id]">) {
  const { id } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      enrollments: {
        where: { active: true },
        include: { student: true },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!batch) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{batch.name}</h1>
          <p className="text-muted-foreground">{batch.subject ?? "No subject"}</p>
        </div>
        <Badge variant={batch.active ? "default" : "secondary"}>
          {batch.active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Monthly fee
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            ₹{batch.monthlyFee}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Enrolled students
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {batch.enrollments.length}
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              nativeButton={false}
              render={<Link href={`/attendance?batchId=${batch.id}`} />}
            >
              Mark attendance
            </Button>
          </CardContent>
        </Card>
      </div>

      {batch.description && (
        <p className="text-muted-foreground">{batch.description}</p>
      )}

      <div>
        <h2 className="mb-3 text-lg font-medium">Enrolled students</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batch.enrollments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No students enrolled yet. Enroll students from the Students page.
                </TableCell>
              </TableRow>
            )}
            {batch.enrollments.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell>
                  <Link
                    href={`/students/${enrollment.studentId}`}
                    className="font-medium hover:underline"
                  >
                    {enrollment.student.name}
                  </Link>
                </TableCell>
                <TableCell>{enrollment.student.phone ?? "—"}</TableCell>
                <TableCell>
                  {enrollment.joinedAt.toLocaleDateString()}
                </TableCell>
                <TableCell>₹{enrollment.feeOverride ?? batch.monthlyFee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

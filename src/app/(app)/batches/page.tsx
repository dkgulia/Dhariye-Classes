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
import { NewBatchButton } from "./new-batch-button";
import { BatchRowActions } from "./batch-row-actions";

export default async function BatchesPage() {
  const batches = await prisma.batch.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Batches</h1>
        <NewBatchButton />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Monthly fee</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No batches yet. Create one to get started.
              </TableCell>
            </TableRow>
          )}
          {batches.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell>
                <Link href={`/batches/${batch.id}`} className="font-medium hover:underline">
                  {batch.name}
                </Link>
              </TableCell>
              <TableCell>{batch.subject ?? "—"}</TableCell>
              <TableCell>₹{batch.monthlyFee}</TableCell>
              <TableCell>{batch._count.enrollments}</TableCell>
              <TableCell>
                <Badge variant={batch.active ? "default" : "secondary"}>
                  {batch.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <BatchRowActions batch={batch} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

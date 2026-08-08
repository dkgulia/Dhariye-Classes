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
import { HistoryFilter } from "./history-filter";

export default async function AttendanceHistoryPage({
  searchParams,
}: PageProps<"/attendance/history">) {
  const params = await searchParams;
  const batchId = typeof params.batchId === "string" ? params.batchId : "";

  const batches = await prisma.batch.findMany({ orderBy: { name: "asc" } });

  const sessions = await prisma.attendanceSession.findMany({
    where: batchId ? { batchId } : undefined,
    include: { batch: true, records: true },
    orderBy: { date: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Attendance history</h1>
        <HistoryFilter batches={batches} batchId={batchId || "all"} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Late</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No attendance sessions recorded yet.
              </TableCell>
            </TableRow>
          )}
          {sessions.map((session) => {
            const present = session.records.filter((r) => r.status === "PRESENT").length;
            const late = session.records.filter((r) => r.status === "LATE").length;
            const absent = session.records.filter((r) => r.status === "ABSENT").length;
            const dateStr = session.date.toISOString().slice(0, 10);
            return (
              <TableRow key={session.id}>
                <TableCell>{session.date.toLocaleDateString()}</TableCell>
                <TableCell>{session.batch.name}</TableCell>
                <TableCell>
                  <Badge>{present}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{late}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">{absent}</Badge>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/attendance?batchId=${session.batchId}&date=${dateStr}`}
                    className="text-sm underline"
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

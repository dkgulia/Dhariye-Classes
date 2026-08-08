"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { saveAttendance } from "./actions";

type Status = "PRESENT" | "ABSENT" | "LATE";

type Batch = { id: string; name: string };
type Student = { id: string; name: string };

const STATUSES: { value: Status; label: string }[] = [
  { value: "PRESENT", label: "Present" },
  { value: "LATE", label: "Late" },
  { value: "ABSENT", label: "Absent" },
];

export function AttendanceForm({
  batches,
  batchId,
  date,
  students,
  initialStatuses,
}: {
  batches: Batch[];
  batchId: string;
  date: string;
  students: Student[];
  initialStatuses: Record<string, Status>;
}) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, Status>>(() => {
    const initial: Record<string, Status> = {};
    for (const student of students) {
      initial[student.id] = initialStatuses[student.id] ?? "PRESENT";
    }
    return initial;
  });
  const [saving, setSaving] = useState(false);

  function navigate(nextBatchId: string, nextDate: string) {
    const params = new URLSearchParams();
    if (nextBatchId) params.set("batchId", nextBatchId);
    if (nextDate) params.set("date", nextDate);
    router.push(`/attendance?${params.toString()}`);
  }

  async function onSave() {
    setSaving(true);
    try {
      await saveAttendance({
        batchId,
        date,
        records: students.map((s) => ({ studentId: s.id, status: statuses[s.id] })),
      });
      toast.success("Attendance saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label>Batch</Label>
          <Select
            value={batchId}
            onValueChange={(value) => value && navigate(value, date)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => navigate(batchId, e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {!batchId ? (
        <p className="text-muted-foreground">Select a batch to mark attendance.</p>
      ) : students.length === 0 ? (
        <p className="text-muted-foreground">
          No active students enrolled in this batch.
        </p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {STATUSES.map((s) => (
                        <Button
                          key={s.value}
                          type="button"
                          size="sm"
                          variant={statuses[student.id] === s.value ? "default" : "outline"}
                          className={cn(
                            statuses[student.id] === s.value &&
                              s.value === "ABSENT" &&
                              "bg-destructive text-destructive-foreground hover:bg-destructive/80",
                            statuses[student.id] === s.value &&
                              s.value === "LATE" &&
                              "bg-secondary text-secondary-foreground",
                          )}
                          onClick={() =>
                            setStatuses((prev) => ({ ...prev, [student.id]: s.value }))
                          }
                        >
                          {s.label}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Saving..." : "Save attendance"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

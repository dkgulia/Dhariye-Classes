"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function HistoryFilter({
  batches,
  batchId,
}: {
  batches: { id: string; name: string }[];
  batchId: string;
}) {
  const router = useRouter();

  return (
    <Select
      value={batchId}
      onValueChange={(value) =>
        router.push(value === "all" ? "/attendance/history" : `/attendance/history?batchId=${value}`)
      }
    >
      <SelectTrigger className="w-64">
        <SelectValue placeholder="All batches" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All batches</SelectItem>
        {batches.map((batch) => (
          <SelectItem key={batch.id} value={batch.id}>
            {batch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

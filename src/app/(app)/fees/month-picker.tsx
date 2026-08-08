"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export function MonthPicker({ month }: { month: string }) {
  const router = useRouter();

  return (
    <Input
      type="month"
      value={month}
      onChange={(e) => router.push(`/fees?month=${e.target.value}`)}
      className="w-40"
    />
  );
}

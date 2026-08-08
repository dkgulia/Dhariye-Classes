"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enrollStudentInBatch } from "./actions";

const formSchema = z.object({
  batchId: z.string().min(1, "Choose a batch"),
  feeOverride: z.number().int().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Batch = { id: string; name: string; monthlyFee: number };

export function EnrollButton({
  studentId,
  availableBatches,
}: {
  studentId: string;
  availableBatches: Batch[];
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { batchId: "", feeOverride: undefined },
  });

  async function onSubmit(values: FormValues) {
    try {
      await enrollStudentInBatch({ studentId, ...values });
      toast.success("Student enrolled");
      form.reset({ batchId: "", feeOverride: undefined });
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" disabled={availableBatches.length === 0}>
            <Plus className="size-4" />
            Enroll in batch
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll in batch</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Batch</Label>
            <Controller
              control={form.control}
              name="batchId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name} (₹{batch.monthlyFee}/mo)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.batchId && (
              <p className="text-sm text-destructive">
                {form.formState.errors.batchId.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="feeOverride">Custom monthly fee (optional)</Label>
            <Input
              id="feeOverride"
              type="number"
              min={0}
              placeholder="Leave blank to use batch fee"
              {...form.register("feeOverride", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Enroll
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

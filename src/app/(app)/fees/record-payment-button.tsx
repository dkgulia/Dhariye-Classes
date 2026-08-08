"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { recordPayment } from "./actions";

const formSchema = z.object({
  amountDue: z.number().int().min(0),
  amountPaid: z.number().int().min(0),
  method: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RecordPaymentButton({
  studentId,
  batchId,
  month,
  studentName,
  batchName,
  defaultAmountDue,
  defaultAmountPaid,
  defaultMethod,
  defaultNotes,
}: {
  studentId: string;
  batchId: string;
  month: string;
  studentName: string;
  batchName: string;
  defaultAmountDue: number;
  defaultAmountPaid: number;
  defaultMethod?: string;
  defaultNotes?: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountDue: defaultAmountDue,
      amountPaid: defaultAmountPaid,
      method: defaultMethod ?? "",
      notes: defaultNotes ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await recordPayment({ studentId, batchId, month, ...values });
      toast.success("Payment recorded");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        Record payment
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {studentName} — {batchName} ({month})
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amountDue">Amount due (₹)</Label>
            <Input
              id="amountDue"
              type="number"
              min={0}
              {...form.register("amountDue", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amountPaid">Amount paid (₹)</Label>
            <Input
              id="amountPaid"
              type="number"
              min={0}
              {...form.register("amountPaid", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="method">Method</Label>
            <Input id="method" placeholder="Cash, UPI, ..." {...form.register("method")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

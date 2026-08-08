"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { createBatch, updateBatch } from "./actions";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  subject: z.string().trim().optional(),
  description: z.string().trim().optional(),
  monthlyFee: z.number().int().min(0, "Fee must be 0 or more"),
});

type FormValues = z.infer<typeof formSchema>;

type Batch = {
  id: string;
  name: string;
  subject: string | null;
  description: string | null;
  monthlyFee: number;
};

export function BatchForm({
  batch,
  onSuccess,
}: {
  batch?: Batch;
  onSuccess: () => void;
}) {
  const isEdit = !!batch;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: batch?.name ?? "",
      subject: batch?.subject ?? "",
      description: batch?.description ?? "",
      monthlyFee: batch?.monthlyFee ?? 0,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (isEdit) {
        await updateBatch(batch.id, values);
        toast.success("Batch updated");
      } else {
        await createBatch(values);
        toast.success("Batch created");
      }
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="e.g. Class 10 Math - Batch A"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" placeholder="e.g. Math" {...form.register("subject")} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="monthlyFee">Monthly fee (₹)</Label>
        <Input
          id="monthlyFee"
          type="number"
          min={0}
          {...form.register("monthlyFee", { valueAsNumber: true })}
        />
        {form.formState.errors.monthlyFee && (
          <p className="text-sm text-destructive">
            {form.formState.errors.monthlyFee.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...form.register("description")} />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isEdit ? "Save changes" : "Create batch"}
        </Button>
      </DialogFooter>
    </form>
  );
}

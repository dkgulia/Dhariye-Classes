"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { createStudent, updateStudent } from "./actions";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().optional(),
  guardianName: z.string().trim().optional(),
  guardianPhone: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Student = {
  id: string;
  name: string;
  phone: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
};

export function StudentForm({
  student,
  onSuccess,
}: {
  student?: Student;
  onSuccess: (studentId: string) => void;
}) {
  const isEdit = !!student;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: student?.name ?? "",
      phone: student?.phone ?? "",
      guardianName: student?.guardianName ?? "",
      guardianPhone: student?.guardianPhone ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (isEdit) {
        await updateStudent(student.id, values);
        toast.success("Student updated");
        onSuccess(student.id);
      } else {
        const created = await createStudent(values);
        toast.success("Student added");
        onSuccess(created.id);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...form.register("phone")} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="guardianName">Guardian name</Label>
        <Input id="guardianName" {...form.register("guardianName")} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="guardianPhone">Guardian phone</Label>
        <Input id="guardianPhone" {...form.register("guardianPhone")} />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isEdit ? "Save changes" : "Add student"}
        </Button>
      </DialogFooter>
    </form>
  );
}

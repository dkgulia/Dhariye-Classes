"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentForm } from "./student-form";

type Student = {
  id: string;
  name: string;
  phone: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
};

export function EditStudentButton({ student }: { student: Student }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Pencil className="size-4" />
            Edit
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit student</DialogTitle>
        </DialogHeader>
        <StudentForm student={student} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentForm } from "./student-form";

export function NewStudentButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            New student
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New student</DialogTitle>
        </DialogHeader>
        <StudentForm
          onSuccess={(studentId) => {
            setOpen(false);
            router.push(`/students/${studentId}`);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

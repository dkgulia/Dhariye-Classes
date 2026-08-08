"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudentForm } from "./student-form";
import { deleteStudent, setStudentActive } from "./actions";

type Student = {
  id: string;
  name: string;
  phone: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  active: boolean;
};

export function StudentRowActions({ student }: { student: Student }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function toggleActive() {
    setMenuOpen(false);
    try {
      await setStudentActive(student.id, !student.active);
      toast.success(student.active ? "Student deactivated" : "Student activated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  async function onDelete() {
    try {
      await deleteStudent(student.id);
      toast.success("Student deleted");
      setDeleteOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setMenuOpen(false);
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleActive}>
            {student.active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setMenuOpen(false);
              setDeleteOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit student</DialogTitle>
          </DialogHeader>
          <StudentForm student={student} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this student?</AlertDialogTitle>
            <AlertDialogDescription>
              This can only be done if the student has no batch enrollments. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

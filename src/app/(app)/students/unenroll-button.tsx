"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { unenrollStudent } from "./actions";

export function UnenrollButton({ enrollmentId }: { enrollmentId: string }) {
  async function onConfirm() {
    try {
      await unenrollStudent(enrollmentId);
      toast.success("Student unenrolled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
        Unenroll
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unenroll this student?</AlertDialogTitle>
          <AlertDialogDescription>
            Their attendance and fee history for this batch will be kept, but
            they will no longer be listed as an active member.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Unenroll</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

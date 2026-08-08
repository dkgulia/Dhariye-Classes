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
import { BatchForm } from "./batch-form";
import { deleteBatch, setBatchActive } from "./actions";

type Batch = {
  id: string;
  name: string;
  subject: string | null;
  description: string | null;
  monthlyFee: number;
  active: boolean;
};

export function BatchRowActions({ batch }: { batch: Batch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function toggleActive() {
    setMenuOpen(false);
    try {
      await setBatchActive(batch.id, !batch.active);
      toast.success(batch.active ? "Batch deactivated" : "Batch activated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  async function onDelete() {
    try {
      await deleteBatch(batch.id);
      toast.success("Batch deleted");
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
            {batch.active ? "Deactivate" : "Activate"}
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
            <DialogTitle>Edit batch</DialogTitle>
          </DialogHeader>
          <BatchForm batch={batch} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this batch?</AlertDialogTitle>
            <AlertDialogDescription>
              This can only be done if no students are enrolled. This cannot be
              undone.
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

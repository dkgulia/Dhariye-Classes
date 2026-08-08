"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BatchForm } from "./batch-form";

export function NewBatchButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            New batch
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New batch</DialogTitle>
        </DialogHeader>
        <BatchForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

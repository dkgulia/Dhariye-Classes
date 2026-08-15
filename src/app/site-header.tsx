"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-[oklch(0.28_0.04_240_/_0.72)] text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-display text-base font-semibold tracking-tight sm:text-lg"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-sun text-brand-ink shadow-sm">
            <GraduationCap className="size-5" />
          </span>
          <span className="truncate">Dhairye Classes</span>
        </Link>

        <div className="hidden md:block">
          <Button
            className="bg-brand-sun text-brand-ink hover:bg-brand-sun/90"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Admin Login
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 md:hidden"
              >
                <Menu className="size-4" />
              </Button>
            }
          />
          <SheetContent side="right" className="bg-background">
            <SheetHeader>
              <SheetTitle className="font-display">Dhairye Classes</SheetTitle>
            </SheetHeader>
            <Button
              className="bg-primary text-primary-foreground"
              nativeButton={false}
              render={<Link href="/login" />}
              onClick={() => setOpen(false)}
            >
              Admin Login
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

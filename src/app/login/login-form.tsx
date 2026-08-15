"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Admin
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Sign in to Dhairye Classes
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage batches, students, attendance, and fees.
        </p>
      </div>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoFocus />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={pending}
          className="mt-2 h-10 w-full bg-primary text-primary-foreground"
        >
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

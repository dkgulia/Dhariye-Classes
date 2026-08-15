import { LoginForm } from "./login-form";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      <div className="relative hidden min-h-[40vh] flex-1 overflow-hidden lg:block lg:min-h-screen">
        <Image
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1400&q=80&auto=format&fit=crop"
          alt="Classroom at Dhairye Classes"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.05_240_/_0.88)] via-[oklch(0.3_0.05_230_/_0.45)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="font-display text-4xl font-semibold tracking-tight">
            Dhairye Classes
          </p>
          <p className="mt-2 max-w-sm text-white/80">
            Admin workspace for batches, students, attendance, and fees.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-background site-mesh px-4 py-12">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold text-brand-ink lg:hidden"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-sun text-brand-ink">
            <GraduationCap className="size-5" />
          </span>
          Dhairye Classes
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}

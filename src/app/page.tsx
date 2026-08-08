import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  MessageCircleQuestion,
  Star,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "./site-header";

const PATHWAY = [
  {
    band: "Primary",
    grades: "Classes 1–5",
    focus: "Build reading, writing, and number sense with gentle, playful practice.",
    subjects: ["English", "Hindi", "Maths", "EVS", "Science basics"],
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80&auto=format&fit=crop",
    accent: "bg-brand-sun text-brand-ink",
  },
  {
    band: "Middle",
    grades: "Classes 6–8",
    focus: "Strengthen concepts, habits, and confidence before board years begin.",
    subjects: ["Maths", "Science", "English", "Social Studies", "Hindi"],
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=900&q=80&auto=format&fit=crop",
    accent: "bg-brand-sky text-white",
  },
  {
    band: "Secondary",
    grades: "Classes 9–12",
    focus: "Exam-ready depth, mocks, and clear guidance for boards and beyond.",
    subjects: ["Maths", "Physics", "Chemistry", "Biology", "English", "Commerce"],
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80&auto=format&fit=crop",
    accent: "bg-primary text-primary-foreground",
  },
];

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Experienced Faculty",
    description: "Subject experts who teach Classes 1–12 with patience and clarity.",
  },
  {
    icon: Users,
    title: "Small Batch Sizes",
    description: "Every student is seen, heard, and challenged — never lost in a crowd.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Doubt-Clearing Sessions",
    description: "Weekly time to clear concepts, not just rush through the syllabus.",
  },
  {
    icon: ClipboardCheck,
    title: "Regular Tests",
    description: "Assessments and progress notes shared with parents every week.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Verma",
    role: "Student, Class 10",
    quote:
      "The doubt-clearing sessions made all the difference. My math scores went up two grades in one term.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Anjali Mehta",
    role: "Parent",
    quote:
      "Small batches mean the teachers actually know my son by name. The weekly progress reports keep us in the loop.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Rohan Kapoor",
    role: "Student, Class 12",
    quote:
      "Coming here through boards was the best call. Mock tests felt tougher than the real exam — in a good way.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&q=80&auto=format&fit=crop",
  },
];

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&q=80&auto=format&fit=crop",
    alt: "Open books and study materials",
  },
  {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80&auto=format&fit=crop",
    alt: "Students collaborating in class",
  },
  {
    src: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&q=80&auto=format&fit=crop",
    alt: "Classroom whiteboard session",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      {/* Hero — brand first, full-bleed image */}
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1800&q=80&auto=format&fit=crop"
          alt="Students learning together at Dhariye Classes"
          fill
          priority
          className="animate-ken-slow object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.05_240_/_0.92)] via-[oklch(0.28_0.05_230_/_0.55)] to-[oklch(0.45_0.08_220_/_0.35)]" />
        <div className="absolute inset-0 site-mesh opacity-40 mix-blend-soft-light" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 md:justify-center md:pb-24">
          <p className="animate-fade-up font-display text-5xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-6xl md:text-7xl lg:text-8xl">
            Dhariye Classes
          </p>
          <h1 className="animate-fade-up delay-1 mt-4 max-w-xl font-display text-xl font-medium leading-snug text-brand-sun sm:text-2xl md:text-3xl">
            Strong foundations for Classes 1–12
          </h1>
          <p className="animate-fade-up delay-2 mt-3 max-w-md text-base text-white/85 sm:text-lg">
            Small batches, clear concepts, and steady progress — so every student feels ready for what comes next.
          </p>
          <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="h-11 bg-brand-sun px-5 text-brand-ink hover:bg-brand-sun/90"
              nativeButton={false}
              render={<a href="#pathway" />}
            >
              See the pathway
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-white/40 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white"
              nativeButton={false}
              render={<a href="#contact" />}
            >
              Talk to us
            </Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why-us" className="relative overflow-hidden site-mesh">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1000&q=80&auto=format&fit=crop"
              alt="Attentive students in a Dhariye Classes classroom"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="reveal">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Why parents choose us
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
              Teaching that fits Classes 1 through 12
            </h2>
            <p className="mt-4 text-muted-foreground">
              From early foundations to board prep, we keep batches small and syllabus tight so every student gets seen, heard, and pushed to do their best.
            </p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <feature.icon className="size-4" />
                  </span>
                  <div>
                    <p className="font-medium text-brand-ink">{feature.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Class 1–12 pathway */}
      <section id="pathway" className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Class 1–12 pathway
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              One journey, three stages
            </h2>
            <p className="mt-3 text-muted-foreground">
              From first notebooks to board exams — the right subjects and pace for every stage.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {PATHWAY.map((stage, index) => (
              <article key={stage.band} className="group flex flex-col">
                <div className="relative mb-5 aspect-[5/3] overflow-hidden rounded-2xl">
                  <Image
                    src={stage.image}
                    alt={`${stage.band} — ${stage.grades} at Dhariye Classes`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <div>
                      <span
                        className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${stage.accent}`}
                      >
                        Step {index + 1}
                      </span>
                      <p className="mt-2 font-display text-2xl font-semibold text-white">
                        {stage.band}
                      </p>
                    </div>
                    <p className="pb-1 text-sm font-medium text-white/90">
                      {stage.grades}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {stage.focus}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {stage.subjects.map((subject) => (
                    <li
                      key={subject}
                      className="rounded-full border border-primary/20 bg-secondary/70 px-3 py-1 text-xs font-medium text-brand-ink"
                    >
                      {subject}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              size="lg"
              className="h-11 bg-primary px-5 text-primary-foreground"
              nativeButton={false}
              render={<a href="#contact" />}
            >
              Ask which stage fits your child
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Campus life */}
      <section id="life" className="border-t site-mesh py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Life at Dhariye Classes
            </h2>
            <p className="mt-3 text-muted-foreground">
              Bright classrooms, focused study hours, and a place students look forward to.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {GALLERY.map((item, i) => (
              <div
                key={item.src}
                className={`relative overflow-hidden rounded-2xl ${
                  i === 1 ? "sm:translate-y-6" : ""
                } h-64 sm:h-80`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t bg-secondary/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Students &amp; parents say
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real progress from the families who learn with us.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.name}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="flex gap-0.5 text-brand-sun">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="flex items-center gap-3">
                  <div className="relative size-11 overflow-hidden rounded-full ring-2 ring-brand-sky/40">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-ink">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-stretch">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Admissions
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Get in touch
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Questions about admissions or batch timings? Reach out — we usually reply within a day.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <MapPin className="size-5" />
                </span>
                <span className="pt-2">123 Education Lane, Sector 12, Your City</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Phone className="size-5" />
                </span>
                <a href="tel:+911234567890" className="pt-2 hover:underline">
                  +91 12345 67890
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Mail className="size-5" />
                </span>
                <a
                  href="mailto:info@dhariyeclasses.com"
                  className="pt-2 break-all hover:underline"
                >
                  info@dhariyeclasses.com
                </a>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-primary p-8 text-primary-foreground shadow-lg sm:p-10">
            <div className="absolute -right-8 -top-8 size-40 rounded-full bg-brand-sun/20" />
            <div className="absolute -bottom-10 -left-6 size-32 rounded-full bg-white/10" />
            <BookOpen className="relative mb-4 size-8 text-brand-sun" />
            <p className="relative font-display text-2xl font-semibold">Visiting hours</p>
            <p className="relative mt-4 text-primary-foreground/85">
              Mon – Sat: 9:00 AM – 7:00 PM
            </p>
            <p className="relative text-primary-foreground/85">Sunday: Closed</p>
            <p className="relative mt-6 text-sm text-primary-foreground/75">
              Call ahead to book a free counselling session for new admissions.
            </p>
            <Button
              className="relative mt-8 h-11 bg-brand-sun text-brand-ink hover:bg-brand-sun/90"
              nativeButton={false}
              render={<a href="tel:+911234567890" />}
            >
              Call now
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t bg-[oklch(0.28_0.04_240)] text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-white/70 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 font-display font-semibold text-white">
            <GraduationCap className="size-5 text-brand-sun" />
            Dhariye Classes
          </div>
          <p>© {new Date().getFullYear()} Dhariye Classes. All rights reserved.</p>
          <Link href="/login" className="hover:text-white hover:underline">
            Admin Login
          </Link>
        </div>
      </footer>
    </div>
  );
}

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex min-h-svh flex-1 flex-col bg-background site-mesh">
        <div className="sticky top-0 z-20 flex items-center gap-2 border-b bg-background/80 px-3 py-3 backdrop-blur sm:px-4">
          <SidebarTrigger />
          <span className="truncate font-display text-sm font-semibold text-brand-ink sm:text-base">
            Dhairye Classes
          </span>
        </div>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}

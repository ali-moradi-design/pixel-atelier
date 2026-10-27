import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/layout/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pb-container grid gap-10 py-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
      <DocsSidebar />
      <main className="min-w-0">{children}</main>
    </div>
  );
}

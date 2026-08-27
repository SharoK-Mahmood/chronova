import { AdminGuard, AdminShell } from "@/features/admin";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}

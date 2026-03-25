import DashboardNav from "@/components/DashboardNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <DashboardNav />
      {children}
    </div>
  );
}

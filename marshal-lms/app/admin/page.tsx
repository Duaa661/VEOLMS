import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { adminGetDashboardStats } from "../data/admin/admin-get-dashboard-stats";


export default async function AdminIndexPage() {
  
      const stats = await adminGetDashboardStats();

  return (
    <>
  <SectionCards stats={stats} />;

        <ChartAreaInteractive />
    </>
  );
}
import { useEffect, useState } from "react";
import { fetchManagerDashboard } from "@/api/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import RecentRequests from "@/components/dashboard/RecentRequests";
import { toast } from "sonner";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import PageHeader from "@/components/PageHeader";

import {
  Wrench,
  Users,
  ClipboardList,
  ClipboardCheck
} from "lucide-react";

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchManagerDashboard();
        setData(res);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return <p className="text-muted-foreground">No dashboard data available.</p>;
  }

  const { stats, recentRequests, team } = data;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Manager Dashboard"
        subtitle={`Team: ${team?.name || "—"}`}
      />

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Equipment"
          value={stats.equipment}
          icon={Wrench}
        />

        <StatCard
          title="Technicians"
          value={team?.technicianCount ?? 0}
          icon={Users}
        />

        <StatCard
          title="Open Requests"
          value={stats.openRequests}
          icon={ClipboardList}
        />

        <StatCard
          title="Completed Requests"
          value={stats.completedRequests}
          icon={ClipboardCheck}
        />
      </div>

      {/* RECENT REQUESTS */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Recent Requests</h2>
        <RecentRequests requests={recentRequests} />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { fetchTechnicianDashboard } from "@/api/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import TechnicianTasks from "@/components/dashboard/TechnicianTasks";
import TechnicianDashboardSkeleton from "@/components/dashboard/TechnicianDashboardSkeleton";
import PageHeader from "@/components/PageHeader";

export default function TechnicianDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechnicianDashboard()
      .then(setData)
      .catch(() => {
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ⏳ Loading state
  if (loading) {
    return <TechnicianDashboardSkeleton />;
  }


  // ❌ Safety guard (prevents crash)
  if (!data) {
    return (
      <p className="text-sm text-red-600">
        Failed to load technician dashboard data.
      </p>
    );
  }

  /**
   * ⚠️ IMPORTANT
   * Backend MUST return:
   * {
   *   stats: {
   *     totalAssigned,
   *     inProgress,
   *     completed,
   *     dueToday
   *   },
   *   myRequests
   * }
   */
  const { stats, myRequests } = data;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Technician Dashboard"
        subtitle="Overview of your maintenance tasks"
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Assigned" value={stats.totalAssigned ?? 0} />
        <StatCard title="In Progress" value={stats.inProgress ?? 0} />
        <StatCard title="Completed" value={stats.completed ?? 0} />
        <StatCard title="Due Today" value={stats.dueToday ?? 0} />
      </div>

      {/* TASK LIST */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          My Tasks
        </h2>
        <TechnicianTasks requests={myRequests || []} />
      </div>
    </div>
  );
}

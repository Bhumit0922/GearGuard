import { useEffect, useState } from "react";
import { fetchUserDashboard } from "@/api/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import UserRequests from "@/components/dashboard/UserRequests";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!data) {
    return (
      <p className="text-sm text-red-600">
        Failed to load dashboard data.
      </p>
    );
  }

  const { stats, myRequests } = data;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="User Dashboard"
          subtitle="Overview of your maintenance requests"
        />

        <Button onClick={() => navigate("/user/requests/new")}>
          Create Request
        </Button>
      </div>


      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Requests" value={stats.total} />
        <StatCard title="Open" value={stats.open} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Scrapped" value={stats.scrapped} />
      </div>

      {/* RECENT REQUESTS */}
      <div className="space-y-2">
        <PageHeader
          title="My Maintenance Requests"
          subtitle="Overview of your submitted requests"
        />

        {myRequests.length === 0 ? (
          <EmptyState
            title="No requests yet"
            description="Create a maintenance request when you notice an issue."
            action={
              <Button onClick={() => navigate("/user/requests/new")}>
                Create Request
              </Button>
            }
          />
        ) : (
          <UserRequests requests={myRequests} />
        )}
      </div>

    </div>
  );
}

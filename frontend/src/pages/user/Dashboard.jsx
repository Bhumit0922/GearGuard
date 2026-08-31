import { useEffect, useState } from "react";
import { fetchUserDashboard } from "@/api/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import UserRequests from "@/components/dashboard/UserRequests";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/ui/EmptyState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { ClipboardList, PlusCircle, CheckCircle2, Clock, Trash2 } from "lucide-react";

const COLORS = ['#3B82F6', '#10B981', '#EF4444']; // Blue, Green, Red

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
      <div className="p-6">
        <p className="text-sm text-destructive">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  const { stats, myRequests } = data;

  const chartData = [
    { name: 'Open', value: stats.open },
    { name: 'Completed', value: stats.completed },
    { name: 'Scrapped', value: stats.scrapped || 0 }, // fallback just in case
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="My Dashboard"
          subtitle="Overview of your submitted requests"
        />

        <Button onClick={() => navigate("/user/requests/new")} className="gap-2 shrink-0">
          <PlusCircle size={16} />
          Report Issue
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Total Requests" value={stats.total} icon={ClipboardList} />
        <StatCard title="Open" value={stats.open} icon={Clock} variant="warning" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} variant="success" />
        <StatCard title="Scrapped" value={stats.scrapped || 0} icon={Trash2} variant="muted" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECENT REQUESTS */}
          <Card className="col-span-1 lg:col-span-2 shadow-sm border-border/50">
             <CardHeader>
               <CardTitle>My Maintenance Requests</CardTitle>
               <CardDescription>Status and history of your reports</CardDescription>
             </CardHeader>
             <CardContent>
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
             </CardContent>
          </Card>

          {/* STATUS PIE CHART */}
          <Card className="col-span-1 shadow-sm border-border/50">
             <CardHeader>
               <CardTitle>Request Status</CardTitle>
               <CardDescription>Breakdown of your submissions</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="h-[250px] w-full">
                  {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                   ) : (
                       <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                           No data
                       </div>
                   )}
                </div>
             </CardContent>
          </Card>
      </div>

    </div>
  );
}

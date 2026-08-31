import { useEffect, useState } from "react";
import { fetchTechnicianDashboard } from "@/api/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import TechnicianTasks from "@/components/dashboard/TechnicianTasks";
import TechnicianDashboardSkeleton from "@/components/dashboard/TechnicianDashboardSkeleton";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { ClipboardList, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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

  if (loading) {
    return <TechnicianDashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="p-6">
         <p className="text-sm text-destructive">Failed to load technician dashboard data.</p>
      </div>
    );
  }

  const { stats, myRequests } = data;

  const chartData = [
    { name: 'To Do', value: Math.max(0, stats.totalAssigned - stats.inProgress - stats.completed) },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Completed', value: stats.completed },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <PageHeader
        title="Technician Dashboard"
        subtitle="Overview of your maintenance tasks"
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Total Assigned" value={stats.totalAssigned ?? 0} icon={ClipboardList} />
        <StatCard title="In Progress" value={stats.inProgress ?? 0} icon={Clock} variant="warning" />
        <StatCard title="Completed" value={stats.completed ?? 0} icon={CheckCircle2} variant="success" />
        <StatCard title="Due Today" value={stats.dueToday ?? 0} icon={AlertCircle} variant="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TASK LIST */}
          <Card className="col-span-1 lg:col-span-2 shadow-sm border-border/50">
             <CardHeader>
               <CardTitle>My Tasks</CardTitle>
               <CardDescription>Recent assignments</CardDescription>
             </CardHeader>
             <CardContent>
                {myRequests?.length > 0 ? (
                  <TechnicianTasks requests={myRequests} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                     <ClipboardList className="h-10 w-10 text-muted-foreground/30 mb-3" />
                     <p className="text-sm text-muted-foreground">You are all caught up.</p>
                  </div>
                )}
             </CardContent>
          </Card>

          {/* TASK STATUS PIE CHART */}
          <Card className="col-span-1 shadow-sm border-border/50">
             <CardHeader>
               <CardTitle>Task Status</CardTitle>
               <CardDescription>Distribution of your workload</CardDescription>
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

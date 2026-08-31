import { useEffect, useState } from "react";
import { fetchManagerDashboard } from "@/api/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import RecentRequests from "@/components/dashboard/RecentRequests";
import { toast } from "sonner";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { exportManagerReport } from "@/api/dashboard";

import {
  Wrench,
  Users,
  ClipboardList,
  ClipboardCheck,
  Activity,
  Download
} from "lucide-react";

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444']; // primary, accent, green, red

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
    return <p className="text-muted-foreground p-6">No dashboard data available.</p>;
  }

  const { stats, recentRequests, team, technicianWorkload } = data;

  const chartData = [
    { name: 'Open', value: stats.openRequests },
    { name: 'Completed', value: stats.completedRequests },
    { name: 'Overdue', value: stats.overdueRequests },
    { name: 'Scrapped', value: stats.scrappedRequests },
  ];

  const handleExport = async () => {
    try {
      const reportData = await exportManagerReport();
      const csvRows = [];
      const headers = Object.keys(reportData[0] || {});
      csvRows.push(headers.join(","));

      for (const row of reportData) {
        const values = headers.map(header => {
          const escaped = ('' + (row[header] || '')).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
      }

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'manager_report.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Report exported successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export report");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <PageHeader
          title="Manager Dashboard"
          subtitle={`Team: ${team?.name || "—"}`}
        />
        <Button onClick={handleExport} className="gap-2">
          <Download size={16} /> Export Report
        </Button>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Equipment" value={stats.equipment} icon={Wrench} trend="+2%" />
        <StatCard title="Technicians" value={team?.technicianCount ?? 0} icon={Users} />
        <StatCard title="Open Requests" value={stats.openRequests} icon={ClipboardList} variant="warning" />
        <StatCard title="Completed Requests" value={stats.completedRequests} icon={ClipboardCheck} variant="success" />
      </div>

      {/* CHARTS AND ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column */}
        <Card className="col-span-1 lg:col-span-2 glass-card hover-card-effect">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                 <Activity className="h-5 w-5 text-primary" />
                 Request Metrics
             </CardTitle>
             <CardDescription>Overview of maintenance requests status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                <XAxis dataKey="name" tick={{fill: 'currentColor'}} className="text-muted-foreground text-xs" />
                <YAxis allowDecimals={false} tick={{fill: 'currentColor'}} className="text-muted-foreground text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Requests Column */}
        <Card className="col-span-1 glass-card hover-card-effect">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest tasks across your team</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRequests?.length > 0 ? (
               <RecentRequests requests={recentRequests} />
            ) : (
               <div className="flex flex-col items-center justify-center py-10 text-center">
                   <ClipboardList className="h-10 w-10 text-muted-foreground/30 mb-3" />
                   <p className="text-sm text-muted-foreground">No recent requests.</p>
               </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TECHNICIAN WORKLOAD */}
      {technicianWorkload && technicianWorkload.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Technician Workload</CardTitle>
            <CardDescription>Track active and overdue tasks across your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicianWorkload.map(tech => (
                <div key={tech.id} className="p-4 rounded-xl bg-muted/30 border border-border/50 flex flex-col gap-2">
                  <div className="font-semibold text-lg">{tech.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                    <div>Assigned: <span className="font-medium text-foreground">{tech.assigned_tasks}</span></div>
                    <div>In Progress: <span className="font-medium text-blue-500">{tech.in_progress_tasks}</span></div>
                    <div>Completed: <span className="font-medium text-emerald-500">{tech.completed_tasks}</span></div>
                    <div>Overdue: <span className="font-medium text-red-500">{tech.overdue_tasks}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

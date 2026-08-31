import { useEffect, useState } from "react";
import { fetchRequests } from "@/api/requests";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestSlideOver from "@/components/requests/RequestSlideOver";
import { Edit2, LayoutGrid, List } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Requests() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔍 Filters
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [type, setType] = useState("all");
    const [priority, setPriority] = useState("all");
    const [sort, setSort] = useState("newest");

    // Slide-over
    const [slideOpen, setSlideOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await fetchRequests({
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
                type: type !== 'all' ? type : undefined,
                priority: priority !== 'all' ? priority : undefined,
                sort
            });
            setRequests(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            try {
                const data = await fetchRequests({
                    search: search || undefined,
                    status: status !== 'all' ? status : undefined,
                    type: type !== 'all' ? type : undefined,
                    priority: priority !== 'all' ? priority : undefined,
                    sort
                });
                if (isMounted) setRequests(data);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        init();
        return () => (isMounted = false);
    }, [search, status, type, priority, sort]);

    const openEdit = (request) => {
        if (user.role === "manager") {
            setSelectedRequest(request);
            setSlideOpen(true);
        } else {
            navigate(`/${user.role}/requests/${request.id}`);
        }
    };

    if (loading) return <div className="p-8">Loading requests...</div>;

    if (loading) return <div className="p-8">Loading requests...</div>;

    // 🎯 Use API filtered results directly
    const filteredRequests = requests;

    const getStatusColor = (status) => {
        switch (status) {
            case "New": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
            case "In Progress": return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20";
            case "Repaired": return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20";
            default: return "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20 border-zinc-500/20";
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Maintenance Requests"
                subtitle="Track and manage all maintenance activity"
            />

            {/* 🔍 FILTER BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-xl border border-border/50 shadow-sm relative z-10">
                <div className="flex flex-wrap gap-3 flex-1">
                    <Input
                        className="w-full sm:max-w-xs"
                        placeholder="Search by subject..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Repaired">Repaired</SelectItem>
                            <SelectItem value="Scrap">Scrap</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Corrective">Corrective</SelectItem>
                            <SelectItem value="Preventive">Preventive</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="LOW">LOW</SelectItem>
                            <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                            <SelectItem value="HIGH">HIGH</SelectItem>
                            <SelectItem value="CRITICAL">CRITICAL</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="priority">By Priority</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 🧾 RESULTS */}
            {filteredRequests.length === 0 ? (
                <EmptyState
                    title="No requests found"
                    description="Try changing search or filters."
                />
            ) : (
                <Tabs defaultValue="table" className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-muted-foreground font-medium">
                            Showing {filteredRequests.length} requests
                        </div>
                        <TabsList className="grid w-[200px] grid-cols-2">
                            <TabsTrigger value="table" className="gap-2"><List size={16}/> Table</TabsTrigger>
                            <TabsTrigger value="kanban" className="gap-2"><LayoutGrid size={16}/> Kanban</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="table" className="mt-0">
                        <Card className="border-border/50 shadow-sm overflow-hidden glass-card">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold px-6 w-1/3">Subject</TableHead>
                                        <TableHead className="font-semibold">Type</TableHead>
                                        <TableHead className="font-semibold">Priority</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Created Date</TableHead>
                                        <TableHead className="font-semibold text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRequests.map((req) => (
                                        <TableRow key={req.id} className="cursor-pointer group hover:bg-muted/30 transition-colors" onClick={() => openEdit(req)}>
                                            <TableCell className="px-6 font-medium group-hover:text-primary transition-colors">
                                                {req.subject}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {req.type}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-medium text-xs">
                                                    {req.priority || "Normal"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getStatusColor(req.status)}>
                                                    {req.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm font-mono">
                                                {format(new Date(req.created_at), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>

                    <TabsContent value="kanban" className="mt-0">
                        <KanbanBoard
                            requests={filteredRequests}
                            onRefresh={loadRequests}
                        />
                    </TabsContent>
                </Tabs>
            )}

            <RequestSlideOver
                open={slideOpen}
                setOpen={setSlideOpen}
                request={selectedRequest}
                onSaved={loadRequests}
                onDelete={loadRequests}
            />
        </div>
    );
}

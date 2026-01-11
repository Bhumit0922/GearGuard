import { useEffect, useState } from "react";
import { fetchRequests } from "@/api/requests";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔍 Filters
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [type, setType] = useState("all");

    const loadRequests = async () => {
        const data = await fetchRequests();
        setRequests(data);
    };

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                const data = await fetchRequests();
                if (isMounted) setRequests(data);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        init();
        return () => (isMounted = false);
    }, []);

    if (loading) return <p>Loading requests...</p>;

    // 🎯 Apply filters
    const filteredRequests = requests.filter((r) => {
        const matchesSearch = r.subject
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesStatus =
            status === "all" ? true : r.status === status;

        const matchesType =
            type === "all" ? true : r.type === type;

        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="space-y-4">
            <PageHeader
                title="Maintenance Requests"
                subtitle="Track and manage all maintenance activity"
            />

            {/* 🔍 FILTER BAR */}
            <div className="flex flex-wrap gap-3">
                {/* Search */}
                <Input
                    className="w-[220px]"
                    placeholder="Search by subject..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Status Filter */}
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Repaired">Repaired</SelectItem>
                        <SelectItem value="Scrap">Scrap</SelectItem>
                    </SelectContent>
                </Select>

                {/* Type Filter */}
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Corrective">Corrective</SelectItem>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 🧾 RESULTS */}
            {filteredRequests.length === 0 ? (
                <EmptyState
                    title="No requests found"
                    description="Try changing search or filters."
                />
            ) : (
                <KanbanBoard
                    requests={filteredRequests}
                    onRefresh={loadRequests}
                />
            )}
        </div>
    );
}

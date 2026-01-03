import { useEffect, useState } from "react";
import { fetchRequests } from "@/api/requests";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/EmptyState";


export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRequests = async () => {
        const data = await fetchRequests();
        setRequests(data);
    };

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                const data = await fetchRequests();
                if (isMounted) {
                    setRequests(data);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) return <p>Loading requests...</p>;

    return (
        <div className="space-y-4">
            <PageHeader
                title="Maintenance Requests"
                subtitle="Track and manage all maintenance activity"
            />

            {requests.length === 0 ? (
                <EmptyState
                    title="No requests found"
                    description="All equipment is healthy. New requests will appear here."
                />
            ) : (
                <KanbanBoard requests={requests} onRefresh={loadRequests} />
            )}
        </div>
    );
}

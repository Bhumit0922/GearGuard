import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { fetchRequests, updateRequestStatus } from "@/api/requests";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import RequestCard from "@/components/kanban/RequestCard";

const COLUMNS = ["New", "In Progress", "Repaired", "Scrap"];

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests()
            .then(setRequests)
            .finally(() => setLoading(false));
    }, []);

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const requestId = active.id;
        const newStatus = over.id;

        const request = requests.find((r) => r.id === requestId);

        if (request.status === newStatus) return;

        try {
            await updateRequestStatus(requestId, newStatus);

            setRequests((prev) =>
                prev.map((r) =>
                    r.id === requestId ? { ...r, status: newStatus } : r
                )
            );
        } catch (err) {
            alert(err.response?.data?.message || "Invalid status change");
        }
    };

    if (loading) return <p>Loading requests...</p>;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Maintenance Requests</h1>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto">
                    {COLUMNS.map((status) => (
                        <KanbanColumn key={status} id={status} title={status}>
                            {requests
                                .filter((r) => r.status === status)
                                .map((r) => (
                                    <RequestCard key={r.id} request={r} />
                                ))}
                        </KanbanColumn>
                    ))}
                </div>
            </DndContext>
        </div>
    );
}

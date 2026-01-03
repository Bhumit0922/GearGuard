import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateRequestStatus, completeRequest } from "@/api/requests";
import { useAuth } from "@/auth/useAuth";
import { toast } from "sonner";

export default function TechnicianActions({ request, onUpdated }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    if (user.role !== "technician") return null;
    if (request.assigned_technician_id !== user.id) return null;

    const startWork = async () => {
        setLoading(true);
        try {
            await updateRequestStatus(request.id, "In Progress");
            toast.success("Work started");
            onUpdated?.();
        } catch {
            toast.error("Failed to start work");
        } finally {
            setLoading(false);
        }
    };

    const completeWork = async () => {
        const duration = Number(prompt("Enter duration (hours)"));
        if (!duration || duration <= 0) {
            toast.error("Invalid duration");
            return;
        }

        setLoading(true);
        try {
            await completeRequest(request.id, duration);
            toast.success("Request completed");
            onUpdated?.();
        } catch {
            toast.error("Failed to complete request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-3">
            {request.status === "New" && (
                <Button onClick={startWork} disabled={loading}>
                    {loading ? "Starting..." : "Start Work"}
                </Button>
            )}

            {request.status === "In Progress" && (
                <Button onClick={completeWork} disabled={loading}>
                    {loading ? "Completing..." : "Complete Work"}
                </Button>
            )}
        </div>
    );
}

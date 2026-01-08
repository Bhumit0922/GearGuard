import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";
import { Badge } from "@/components/ui/badge";
import RequestInfo from "@/components/requests/RequestInfo";
import AuditTimeline from "@/components/requests/AuditTimeline";
import { useAuth } from "@/auth/useAuth";
import TechnicianActions from "@/components/requests/TechnicianActions";
import ManagerActions from "@/components/requests/ManagerActions";
import RequestDetailsSkeleton from "@/components/dashboard/RequestDetailsSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import PageHeader from "@/components/PageHeader";
export default function RequestDetails() {
    const { id } = useParams();
    const { user } = useAuth();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadRequest = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/requests/${id}`);
            setRequest(res.data.data);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load request");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadRequest();
    }, [loadRequest]);


    if (loading) {
        return <RequestDetailsSkeleton />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                action={
                    <button
                        onClick={loadRequest}
                        className="text-sm underline"
                    >
                        Retry
                    </button>
                }
            />
        );
    }


    if (!request) {
        return <p className="text-muted-foreground">Request not found.</p>;
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <PageHeader
                    title={request.subject}
                    subtitle={`Status: ${request.status}`}
                />

                <Badge variant="outline">{request.status}</Badge>
            </div>

            {/* INFO */}
            <RequestInfo request={request} />

            {/* ROLE-BASED ACTIONS */}
            <div className="p-4 border rounded-md bg-muted space-y-2">
                {user.role === "user" && (
                    <p className="text-sm text-muted-foreground">
                        You can track the status of this request here.
                    </p>
                )}

                {user.role === "technician" && (
                    <TechnicianActions
                        request={request}
                        onUpdated={loadRequest}
                    />
                )}

                {user.role === "manager" && (
                    <ManagerActions
                        request={request}
                        onUpdated={loadRequest}
                    />
                )}

            </div>

            {/* AUDIT LOG */}
            <AuditTimeline logs={request.logs || []} />
        </div>
    );
}

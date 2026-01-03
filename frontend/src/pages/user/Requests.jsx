import { useEffect, useState } from "react";
import { fetchRequests } from "@/api/requests";
import UserRequests from "@/components/dashboard/UserRequests";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function UserRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests()
            .then(setRequests)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading requests...</p>;

    return (
        <div className="space-y-4">
            <PageHeader
                title="My Maintenance Requests"
                subtitle="Requests you have submitted"
            />

            {/* CREATE BUTTON */}
            <div className="flex justify-end">
                <Link to="/user/requests/new">
                    <Button>Create Request</Button>
                </Link>
            </div>

            {requests.length === 0 ? (
                <EmptyState
                    title="No requests yet"
                    description="Create a request when you face equipment issues."
                />
            ) : (
                <UserRequests requests={requests} />
            )}
        </div>
    );
}

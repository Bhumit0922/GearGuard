import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RequestInfo({ request }) {
    return (
        <Card className="p-4 space-y-3">
            <div className="flex justify-between">
                <h2 className="font-semibold">{request.subject}</h2>
                <Badge>{request.status}</Badge>
            </div>

            <div className="text-sm text-muted-foreground">
                <p>Type: {request.type}</p>
                <p>Equipment ID: {request.equipment_id}</p>
                <p>Created By: User #{request.created_by}</p>
                <p>Assigned Technician: {request.assigned_technician_id || "—"}</p>
            </div>
        </Card>
    );
}

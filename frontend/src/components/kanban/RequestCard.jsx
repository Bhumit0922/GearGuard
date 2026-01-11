import { Card } from "@/components/ui/card";
import  StatusBadge  from "@/components/ui/StatusBadge";

export default function KanbanCard({ request }) {
    return (
        <Card className="p-3 space-y-2">
            <div className="font-medium">{request.subject}</div>

            <div className="text-xs text-muted-foreground space-y-1">
                <div>Type: {request.type}</div>

                <div>
                    Team:{" "}
                    <span className="font-medium">
                        {request.team_name || "—"}
                    </span>
                </div>

                <div>
                    Technician:{" "}
                    <span className="font-medium">
                        {request.technician_name || "Unassigned"}
                    </span>
                </div>
            </div>
            <StatusBadge status={request.status} />
        </Card>
    );
}

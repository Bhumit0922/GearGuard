import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RequestInfo({ request }) {
    return (
        <Card className="p-4 space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="font-semibold">{request.subject}</h2>
                <Badge>{request.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <p><strong>Type:</strong> {request.type}</p>
                <p><strong>Equipment:</strong> {request.equipment_name}</p>

                <p>
                    <strong>Team:</strong>{" "}
                    {request.team_name || "Not assigned"}
                </p>

                <p>
                    <strong>Technician:</strong>{" "}
                    {request.technician_name || "Not assigned"}
                </p>

                <p>
                    <strong>Created By:</strong> User #{request.created_by}
                </p>
            </div>
        </Card>
    );
}

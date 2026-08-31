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
                
                <p><strong>Priority:</strong> <Badge variant="outline">{request.priority || "Normal"}</Badge></p>
                {request.due_at && <p><strong>Due:</strong> {new Date(request.due_at).toLocaleString()}</p>}
                
                {request.status === 'Repaired' && (
                    <>
                        <p><strong>Duration:</strong> {request.duration_hours} hours</p>
                        <p><strong>Labor Cost:</strong> ${request.labor_cost}</p>
                        <p><strong>Parts Cost:</strong> ${request.parts_cost}</p>
                        <p className="col-span-2 text-lg mt-2 border-t pt-2 border-border/50">
                            <strong>Total Cost:</strong> <span className="text-emerald-500 font-semibold">${Number(request.labor_cost) + Number(request.parts_cost)}</span>
                        </p>
                    </>
                )}
            </div>
        </Card>
    );
}

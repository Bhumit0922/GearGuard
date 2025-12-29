import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AuditTimeline({ logs }) {
    return (
        <Card className="p-4">
            <h3 className="font-semibold mb-3">Audit Log</h3>

            {logs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No status changes yet.
                </p>
            )}

            <div className="space-y-3">
                {logs.map((log, i) => (
                    <div key={log.id}>
                        <div className="text-sm">
                            <strong>{log.old_status}</strong> →{" "}
                            <strong>{log.new_status}</strong>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            by {log.changed_by_name} •{" "}
                            {new Date(log.changed_at).toLocaleString()}
                        </div>
                        {i !== logs.length - 1 && <Separator className="my-2" />}
                    </div>
                ))}
            </div>
        </Card>
    );
}

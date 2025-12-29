import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function RequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await api.get(`/requests/${id}`);
        const logRes = await api.get(`/requests/${id}/logs`);

        setRequest(res.data.data);
        setLogs(logRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);

  if (loading) return <p>Loading request...</p>;
  if (!request) return <p>Request not found</p>;

  return (
    <div className="space-y-6">
      {/* REQUEST SUMMARY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {request.subject}
            <Badge>{request.status}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <p><strong>Type:</strong> {request.type}</p>
          <p><strong>Equipment ID:</strong> {request.equipment_id}</p>
          <p><strong>Assigned Technician:</strong> {request.assigned_technician_id ?? "Not assigned"}</p>
          <p><strong>Created At:</strong> {new Date(request.created_at).toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* AUDIT LOG */}
      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {logs.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No status changes yet.
            </p>
          )}

          {logs.map((log) => (
            <div key={log.id}>
              <div className="flex justify-between text-sm">
                <span>
                  {log.old_status} → <strong>{log.new_status}</strong>
                </span>
                <span className="text-muted-foreground">
                  {log.changed_by_name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(log.changed_at).toLocaleString()}
              </p>
              <Separator className="my-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

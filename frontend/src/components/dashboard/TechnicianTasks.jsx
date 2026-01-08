import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import EmptyState from "@/components/ui/EmptyState";

export default function TechnicianTasks({ requests }) {
    if (!requests.length) {
        return (
            <EmptyState
                title="No tasks assigned"
                description="You’ll see tasks here once a manager assigns them to you."
            />
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {requests.map((r) => (
                    <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.subject}</TableCell>
                        <TableCell>{r.equipment_name}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{r.status}</Badge>
                        </TableCell>
                        <TableCell>{r.team_name || "—"}</TableCell>
                        <TableCell>
                            <Link
                                to={`/technician/requests/${r.id}`}
                                className="text-primary hover:underline text-sm"
                            >
                                View
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

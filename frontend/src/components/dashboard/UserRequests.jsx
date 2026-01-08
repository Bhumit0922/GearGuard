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

export default function UserRequests({ requests }) {
    if (!requests.length) {
        return (
            <EmptyState
                title="No maintenance requests"
                description="All equipment is running smoothly. New requests will appear here."
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
                    <TableHead>Technician</TableHead>
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
                        <TableCell>{r.technician_name || "—"}</TableCell>
                        <TableCell>
                            <Link
                                to={`/user/requests/${r.id}`}
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

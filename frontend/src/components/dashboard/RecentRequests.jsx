import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui/StatusBadge";

export default function RecentRequests({ requests }) {
    if (requests.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No recent maintenance requests.
            </p>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {requests.map((r) => (
                    <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.subject}</TableCell>
                        <TableCell>{r.equipment_name}</TableCell>
                        <TableCell>
                            {/* <Badge variant="outline">{r.status}</Badge> */}
                            <StatusBadge status={r.status} />
                        </TableCell>
                        <TableCell>{r.type}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

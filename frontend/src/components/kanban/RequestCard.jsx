import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function KanbanCard({ request }) {
    return (
        <Card
            className="
            p-3 space-y-2 cursor-grab
            transition-transform duration-200 ease-out
            hover:shadow-md
            "
        >
            <div className="font-medium">{request.subject}</div>

            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{request.type}</span>
                <Badge variant="outline">{request.status}</Badge>
            </div>
        </Card>
    );
}

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RequestCard({ request }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: request.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="p-3 space-y-2 cursor-grab"
        >
            <div className="font-medium">{request.subject}</div>

            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{request.type}</span>
                <Badge variant="outline">{request.status}</Badge>
            </div>
        </Card>
    );
}

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
        <div className="flex flex-col space-y-1">
            {requests.map((r) => (
                <div 
                    key={r.id} 
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 group"
                >
                    <div className="flex flex-col gap-1 min-w-0 pr-2">
                        <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {r.subject}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                            {r.equipment_name && (
                                <span className="truncate max-w-[120px]">{r.equipment_name}</span>
                            )}
                            {r.equipment_name && <span>&bull;</span>}
                            <span>{r.type}</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <StatusBadge status={r.status} />
                    </div>
                </div>
            ))}
        </div>
    );
}

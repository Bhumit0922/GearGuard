import { Skeleton } from "@/components/ui/skeleton";

export default function KanbanLoadingOverlay() {
    return (
        <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px] w-[260px]" />
            ))}
        </div>
    );
}

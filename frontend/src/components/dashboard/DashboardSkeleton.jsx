import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Skeleton className="h-8 w-64" />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>

            {/* Table */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
}

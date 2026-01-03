import { Skeleton } from "@/components/ui/skeleton";

export default function TechnicianDashboardSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-64" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>

            <Skeleton className="h-48 w-full" />
        </div>
    );
}

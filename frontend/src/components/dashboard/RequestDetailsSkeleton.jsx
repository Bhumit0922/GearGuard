import { Skeleton } from "@/components/ui/skeleton";

export default function RequestDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
    );
}

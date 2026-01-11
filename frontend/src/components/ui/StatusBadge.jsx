import { Badge } from "@/components/ui/badge";

const STATUS_VARIANTS = {
    New: "bg-blue-100 text-blue-700 border-blue-300",
    "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-300",
    Repaired: "bg-green-100 text-green-700 border-green-300",
    Scrap: "bg-red-100 text-red-700 border-red-300",
};

export default function StatusBadge({ status }) {
    return (
        <Badge
            variant="outline"
            className={STATUS_VARIANTS[status] || ""}
        >
            {status}
        </Badge>
    );
}

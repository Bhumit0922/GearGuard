import { Card } from "@/components/ui/card";

export default function StatCard({ title, value }) {
    return (
        <Card className="p-4 transition-all duration-300">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h2 className="text-2xl font-bold mt-1">{value}</h2>
        </Card>
    );
}

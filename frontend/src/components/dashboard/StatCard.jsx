import { Card } from "@/components/ui/card";

export default function StatCard({ title, value, icon: Icon }) {
    return (
        <Card className="p-4 flex items-center gap-3">
            {Icon && <Icon size={20} className="text-muted-foreground" />}
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <h2 className="text-2xl font-bold">{value}</h2>
            </div>
        </Card>
    );
}

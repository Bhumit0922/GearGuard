import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, variant = "default", trend }) {
    
    // Theme mapping for variants
    const variantStyles = {
        default: "bg-primary/10 text-primary border-primary/20",
        warning: "bg-accent/10 text-accent border-accent/20",
        success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };

    const iconBgStyle = variantStyles[variant] || variantStyles.default;

    return (
        <Card className="p-5 flex flex-col justify-between gap-4 overflow-hidden relative glass-card hover-card-effect group">
            {/* Background ambient glow based on variant */}
            {variant === 'default' && <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors"></div>}
            {variant === 'warning' && <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 transition-colors"></div>}
            {variant === 'success' && <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors"></div>}

            <div className="flex items-center justify-between relative z-10">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className={cn("p-2 rounded-lg border", iconBgStyle)}>
                    {Icon && <Icon size={20} />}
                </div>
            </div>
            
            <div className="relative z-10 flex items-end justify-between">
                <h2 className="text-4xl font-display font-bold tracking-tight">{value}</h2>
                {trend && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 mb-1">
                        {trend}
                    </span>
                )}
            </div>
        </Card>
    );
}

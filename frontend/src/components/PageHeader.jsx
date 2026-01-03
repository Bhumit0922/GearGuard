export default function PageHeader({ title, subtitle }) {
    return (
        <div className="space-y-1 mb-6">
            <h1 className="text-2xl font-semibold">{title}</h1>
            {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
        </div>
    );
}

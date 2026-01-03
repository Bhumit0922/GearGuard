export default function EmptyState({ title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
                {description}
            </p>
            {action && <div>{action}</div>}
        </div>
    );
}

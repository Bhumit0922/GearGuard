export default function ErrorState({ message, action }) {
    return (
        <div className="border border-destructive/30 bg-destructive/10 rounded-md p-4 space-y-2">
            <p className="text-sm text-destructive">{message}</p>
            {action}
        </div>
    );
}

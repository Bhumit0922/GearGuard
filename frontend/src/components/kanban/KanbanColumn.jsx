import { useDroppable } from "@dnd-kit/core";

export default function KanbanColumn({ id, title, children }) {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[260px]">
            <h2 className="mb-2 text-sm font-semibold">{title}</h2>
            <div className="space-y-3 min-h-[100px]">
                {children}
            </div>
        </div>
    );
}

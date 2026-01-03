import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import { updateRequestStatus } from "@/api/requests";
import { toast } from "sonner";

const STATUSES = ["New", "In Progress", "Repaired", "Scrap"];

export default function KanbanBoard({ requests, onRefresh }) {
  const [updating, setUpdating] = useState(false);

  const onDragEnd = async (result) => {
    if (updating) return;

    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    setUpdating(true);
    try {
      await updateRequestStatus(draggableId, destination.droppableId);
      onRefresh?.();
    } catch {
      toast.error("Failed to update request");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className={`flex gap-4 overflow-x-auto ${updating ? "opacity-70 pointer-events-none" : ""
          }`}
      >
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            requests={requests.filter((r) => r.status === status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

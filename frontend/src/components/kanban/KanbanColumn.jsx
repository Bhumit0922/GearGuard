import { Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanCard from "./RequestCard";

export default function KanbanColumn({ status, requests }) {
  return (
    <div className="min-w-[260px] rounded-md bg-muted p-3">
      <h3 className="mb-3 font-semibold">{status}</h3>

      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="
            space-y-2 min-h-[100px]
            transition-colors duration-200
           "
          >

            {requests.map((req, index) => (
              <Draggable
                draggableId={String(req.id)}
                index={index}
                key={req.id}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <KanbanCard request={req} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

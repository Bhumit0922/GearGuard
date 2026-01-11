import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchPreventiveCalendar } from "@/api/requests";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/ui/StatusBadge";

export default function PreventiveCalendar() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPreventiveCalendar();

                const mapped = data
                    .filter((r) => r.scheduled_date) // ✅ avoid null dates
                    .map((r) => ({
                        id: String(r.id),
                        title: r.subject,
                        date: r.scheduled_date,
                        backgroundColor: getColor(r.status),
                        borderColor: getColor(r.status),
                        extendedProps: {
                            status: r.status,
                            equipment: r.equipment_name,
                        },
                    }));

                setEvents(mapped);
            } catch {
                toast.error("Failed to load preventive calendar");
            }
        };

        load();
    }, []);

    const handleEventClick = (info) => {
        navigate(`/manager/requests/${info.event.id}`);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Preventive Maintenance Calendar"
                subtitle="Scheduled preventive maintenance activities"
            />

            <div className="rounded-md border bg-background p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                    eventClick={handleEventClick}
                    eventContent={(info) => (
                        <div className="space-y-1">
                            <div className="text-xs font-medium">
                                {info.event.title}
                            </div>
                            {/* <Badge variant="outline" className="text-[10px]">
                                {info.event.extendedProps.status}
                            </Badge> */}
                            <StatusBadge status={info.event.extendedProps.status} />
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

/* 🎨 Status Colors */
function getColor(status) {
    switch (status) {
        case "New":
            return "#2563eb"; // blue
        case "In Progress":
            return "#ca8a04"; // yellow
        case "Repaired":
            return "#16a34a"; // green
        default:
            return "#6b7280"; // gray
    }
}

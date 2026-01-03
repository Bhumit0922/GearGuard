import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import api from "@/api/axios";
import { toast } from "sonner";

export default function ManagerActions({ request, onUpdated }) {
    const [technicians, setTechnicians] = useState([]);
    const [selectedTech, setSelectedTech] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/users/technicians").then((res) => {
            setTechnicians(res.data.data);
        });
    }, []);

    const assignTechnician = async () => {
        if (!selectedTech) {
            toast.error("Select a technician");
            return;
        }

        try {
            setLoading(true);
            await api.patch(`/requests/${request.id}/assign`, {
                technicianId: selectedTech,
            });
            toast.success("Technician assigned");
            onUpdated();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to assign");
        } finally {
            setLoading(false);
        }
    };

    const scrapRequest = async () => {
        if (!confirm("Scrap this request and equipment?")) return;

        try {
            setLoading(true);
            await api.patch(`/requests/${request.id}/scrap`);
            toast.success("Request scrapped");
            onUpdated();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to scrap");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Assign Technician */}
            {!request.assigned_technician_id && request.status === "New" && (
                <div className="flex gap-3 items-end">
                    <Select value={selectedTech} onValueChange={setSelectedTech}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select technician" />
                        </SelectTrigger>

                        <SelectContent>
                            {technicians.map((t) => (
                                <SelectItem key={t.id} value={String(t.id)}>
                                    {t.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                    <Button onClick={assignTechnician} disabled={loading}>
                        Assign
                    </Button>
                </div>
            )}

            {/* Scrap */}
            {request.status !== "Repaired" && (
                <Button
                    variant="destructive"
                    onClick={scrapRequest}
                    disabled={loading}
                >
                    Scrap Request
                </Button>
            )}
        </div>
    );
}

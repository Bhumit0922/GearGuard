import { Card } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";
import { assignTechnicianToTeam } from "@/api/teams";
import { useEffect, useState } from "react";

export default function TeamCard({ team, onUpdated }) {
    const [technicians, setTechnicians] = useState([]);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        api.get("/users/technicians").then((res) => {
            setTechnicians(res.data.data);
        });
    }, []);

    const handleAssign = async () => {
        await assignTechnicianToTeam(team.id, selected);
        setSelected("");
        onUpdated?.();
    };

    return (
        <Card className="p-4 space-y-3">
            <h3 className="font-semibold">{team.name}</h3>

            <ul className="text-sm text-muted-foreground">
                {team.technicians?.length ? (
                    team.technicians.map((t) => (
                        <li key={t.id}>• {t.name}</li>
                    ))
                ) : (
                    <li>No technicians</li>
                )}
            </ul>

            <div className="flex gap-2">
                <Select value={selected} onValueChange={setSelected}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Add technician" />
                    </SelectTrigger>

                    <SelectContent>
                        {technicians.map((t) => (
                            <SelectItem key={t.id} value={String(t.id)}>
                                {t.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button size="sm" onClick={handleAssign} disabled={!selected}>
                    Assign
                </Button>
            </div>
        </Card>
    );
}

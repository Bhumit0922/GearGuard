import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { assignEquipmentTeam } from "@/api/equipment";

export default function AssignTeamCell({ equipment, onUpdated }) {
    const [teams, setTeams] = useState([]);
    const [selected, setSelected] = useState(
        equipment.maintenance_team_id
            ? String(equipment.maintenance_team_id)
            : ""
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/teams").then((res) => {
            setTeams(res.data.data || []);
        });
    }, []);

    const handleAssign = async () => {
        if (!selected) return;

        try {
            setLoading(true);
            await assignEquipmentTeam(equipment.id, Number(selected));
            onUpdated?.();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select team" />
                </SelectTrigger>

                <SelectContent>
                    {teams.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                            {t.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                size="sm"
                onClick={handleAssign}
                disabled={loading || !selected}
            >
                {loading ? "Saving..." : "Assign"}
            </Button>
        </div>
    );
}

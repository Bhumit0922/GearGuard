import { useEffect, useState } from "react";
import { fetchEquipment } from "@/api/equipment";
import { createRequest } from "@/api/requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export default function CreateRequestForm() {
    const [equipment, setEquipment] = useState([]);
    const [equipmentId, setEquipmentId] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchEquipment().then(setEquipment);
    }, []);

    const submit = async () => {
        setLoading(true);
        try {
            await createRequest({
                equipmentId,
                type,
                description,
            });
            navigate("/user/requests");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md space-y-4">
            {/* Equipment */}
            <Select value={equipmentId} onValueChange={setEquipmentId}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Equipment" />
                </SelectTrigger>
                <SelectContent>
                    {equipment.map((e) => (
                        <SelectItem key={e.id} value={String(e.id)}>
                            {e.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Type */}
            <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                    <SelectValue placeholder="Request Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                </SelectContent>
            </Select>

            {/* Description */}
            <Textarea
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <Button
                onClick={submit}
                disabled={!equipmentId || !type || !description || loading}
            >
                {loading ? "Submitting..." : "Submit Request"}
            </Button>
        </div>
    );
}

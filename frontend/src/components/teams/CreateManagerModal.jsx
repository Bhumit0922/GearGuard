import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { fetchTeams } from "@/api/teams";
// import api from "@/api/axios";
import { createManager } from "@/api/users";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function CreateManagerModal({ open, onClose }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        teamId: "",
    });

    useEffect(() => {
        if (open) {
            fetchTeams().then(setTeams);
        }
    }, [open]);

    const submit = async () => {
        if (!form.name || !form.email || !form.password || !form.teamId) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);

            await createManager({
                name: form.name,
                email: form.email,
                password: form.password,
                teamId: Number(form.teamId),
            });

            toast.success("Manager created successfully");

            setForm({
                name: "",
                email: "",
                password: "",
                teamId: "",
            });

            onClose();
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to create manager"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-4">

                {/* REQUIRED FOR ACCESSIBILITY */}
                <DialogTitle>Create Manager</DialogTitle>
                <DialogDescription>
                    Create a new manager and assign them to a maintenance team.
                </DialogDescription>

                {/* Name */}
                <Input
                    placeholder="Manager name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                {/* Email */}
                <Input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                {/* Password */}
                <Input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                {/* Team */}
                <Select
                    value={form.teamId}
                    onValueChange={(v) =>
                        setForm({ ...form, teamId: v })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Assign team" />
                    </SelectTrigger>

                    <SelectContent>
                        {teams.map((team) => (
                            <SelectItem key={team.id} value={String(team.id)}>
                                {team.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Submit */}
                <Button
                    onClick={submit}
                    disabled={
                        loading ||
                        !form.name ||
                        !form.email ||
                        !form.password ||
                        !form.teamId
                    }
                >
                    {loading ? "Creating..." : "Create Manager"}
                </Button>

            </DialogContent>
        </Dialog>

    );
}

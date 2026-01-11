import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createTeam } from "@/api/teams";

export default function CreateTeamModal({ open, onClose, onCreated }) {
    const [name, setName] = useState("");

    const submit = async () => {
        await createTeam(name);
        setName("");
        onCreated();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-4">
                {/* REQUIRED FOR ACCESSIBILITY */}
                <DialogTitle>Create Team</DialogTitle>
                <DialogDescription>
                    Create a new maintenance team.
                </DialogDescription>

                <Input
                    placeholder="Team name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Button onClick={submit} disabled={!name}>
                    Create
                </Button>
            </DialogContent>
        </Dialog>
    );
}

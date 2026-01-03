import { Dialog, DialogContent } from "@/components/ui/dialog";
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
            <DialogContent>
                <h2 className="font-semibold text-lg">Create Team</h2>

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

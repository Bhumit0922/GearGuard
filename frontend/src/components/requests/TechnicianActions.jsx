import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateRequestStatus, completeRequest } from "@/api/requests";
import { useAuth } from "@/auth/useAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TechnicianActions({ request, onUpdated }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [duration, setDuration] = useState("");
    const [partsCost, setPartsCost] = useState("");

    if (user.role !== "technician") return null;
    if (request.assigned_technician_id !== user.id) return null;

    const startWork = async () => {
        setLoading(true);
        try {
            await updateRequestStatus(request.id, "In Progress");
            toast.success("Work started");
            onUpdated?.();
        } catch {
            toast.error("Failed to start work");
        } finally {
            setLoading(false);
        }
    };

    const submitCompletion = async (e) => {
        e.preventDefault();
        const d = Number(duration);
        if (!d || d <= 0) {
            toast.error("Invalid duration");
            return;
        }

        setLoading(true);
        try {
            await completeRequest(request.id, d, Number(partsCost) || 0);
            toast.success("Request completed");
            setShowModal(false);
            onUpdated?.();
        } catch {
            toast.error("Failed to complete request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex gap-3">
                {request.status === "New" && (
                    <Button onClick={startWork} disabled={loading}>
                        {loading ? "Starting..." : "Start Work"}
                    </Button>
                )}

                {request.status === "In Progress" && (
                    <Button onClick={() => setShowModal(true)} disabled={loading}>
                        Complete Work
                    </Button>
                )}
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complete Maintenance Request</DialogTitle>
                        <DialogDescription>
                            Log your work hours and any additional parts cost to close this request.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitCompletion} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Duration (Hours)</Label>
                            <Input 
                                type="number" 
                                step="0.5" 
                                required 
                                value={duration} 
                                onChange={(e) => setDuration(e.target.value)} 
                                placeholder="e.g. 2.5" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Parts Cost ($) - Optional</Label>
                            <Input 
                                type="number" 
                                step="0.01" 
                                value={partsCost} 
                                onChange={(e) => setPartsCost(e.target.value)} 
                                placeholder="e.g. 150.00" 
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading || !duration}>
                                {loading ? "Saving..." : "Mark Completed"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateRequest, deleteRequest, assignTechnician } from "@/api/requests";
import api from "@/api/axios";
import { Loader2, Trash2, ClipboardList } from "lucide-react";
import { toast } from "sonner";

export default function RequestSlideOver({ open, setOpen, request, onSaved, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    status: "",
    priority: "",
    assigned_technician_id: "",
  });

  useEffect(() => {
    if (request) {
      setFormData({
        subject: request.subject || "",
        status: request.status || "New",
        priority: request.priority || "Low",
        assigned_technician_id: request.assigned_technician_id ? String(request.assigned_technician_id) : "none",
      });
    }
  }, [request]);

  useEffect(() => {
    if (open) {
       api.get("/users/technicians").then((res) => {
           setTechnicians(res.data.data);
       });
    }
  }, [open]);

  const handleChange = (e) => {
    if (e.target) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSelectChange = (name, value) => {
      setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request) return;

    setLoading(true);
    try {
      const payload = { ...formData };
      if (payload.assigned_technician_id === "none") {
          payload.assigned_technician_id = null;
      }
      
      await updateRequest(request.id, payload);
      
      if (payload.assigned_technician_id && payload.assigned_technician_id !== String(request.assigned_technician_id)) {
         await assignTechnician(request.id, payload.assigned_technician_id);
      }
      
      onSaved();
      setOpen(false);
    } catch {
      // Toast handles error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!request) return;
    if (!confirm("Are you sure you want to delete this maintenance request? This action is irreversible.")) return;

    setLoading(true);
    try {
       await deleteRequest(request.id);
       onDelete();
       setOpen(false);
    } catch {
      // handled
    } finally {
       setLoading(false);
    }
  };


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col h-full bg-card sm:max-w-md w-full border-l border-border/50 shadow-2xl">
        <SheetHeader className="pb-4 border-b border-border/50">
          <SheetTitle className="text-xl flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Manage Request
          </SheetTitle>
          <SheetDescription>Update priorities, assignments, and details.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-2">
          <form id="request-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input name="subject" value={formData.subject} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(val) => handleSelectChange("status", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Repaired">Repaired</SelectItem>
                  <SelectItem value="Scrap">Scrap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(val) => handleSelectChange("priority", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigned Technician</Label>
              <Select value={formData.assigned_technician_id} onValueChange={(val) => handleSelectChange("assigned_technician_id", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {technicians.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                          {t.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
          </form>
        </div>

        <SheetFooter className="mt-auto pt-6 flex !flex-row !justify-between items-center border-t border-border/50">
           <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading} className="gap-2 shrink-0">
              <Trash2 className="h-4 w-4" />
              Delete
           </Button>
           
           <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                 Cancel
              </Button>
              <Button form="request-form" type="submit" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Save Request
              </Button>
           </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

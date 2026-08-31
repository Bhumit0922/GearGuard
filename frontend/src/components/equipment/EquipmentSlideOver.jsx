import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateEquipment, deleteEquipment, fetchEquipmentHistory } from "@/api/equipment";
import { Loader2, Trash2 } from "lucide-react";

export default function EquipmentSlideOver({ open, setOpen, equipment, onSaved, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    serial_number: "",
    department: "",
    location: "",
    warranty_expiry: "",
    pm_frequency_days: "",
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || "",
        serial_number: equipment.serial_number || "",
        department: equipment.department || "",
        location: equipment.location || "",
        warranty_expiry: equipment.warranty_expiry ? equipment.warranty_expiry.split('T')[0] : "",
        pm_frequency_days: equipment.pm_frequency_days || "",
      });
      fetchEquipmentHistory(equipment.id).then(setHistory).catch(() => {});
    } else {
      setHistory([]);
    }
  }, [equipment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!equipment) return;

    setLoading(true);
    try {
      await updateEquipment(equipment.id, formData);
      onSaved();
      setOpen(false);
    } catch {
      // Toast handles error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!equipment) return;
    if (!confirm("Are you sure you want to delete this equipment? This cannot be undone.")) return;

    setLoading(true);
    try {
       await deleteEquipment(equipment.id);
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
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">Edit Equipment</SheetTitle>
          <SheetDescription>Update the details of {equipment?.name}.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Equipment Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="space-y-2">
              <Label>Serial Number</Label>
              <Input name="serial_number" value={formData.serial_number} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Input name="department" value={formData.department} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input name="location" value={formData.location} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>Warranty Expiry</Label>
              <Input type="date" name="warranty_expiry" value={formData.warranty_expiry} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label>PM Frequency (Days)</Label>
              <Input type="number" name="pm_frequency_days" value={formData.pm_frequency_days} onChange={handleChange} placeholder="e.g. 90" />
            </div>
          </div>
          
          {history.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-border/50">
              <h3 className="font-semibold">Maintenance History</h3>
              <div className="space-y-3">
                {history.map(req => (
                  <div key={req.id} className="p-3 bg-muted/50 rounded-lg text-sm flex flex-col gap-1">
                    <div className="flex justify-between font-medium">
                      <span>{req.subject}</span>
                      <span className="text-muted-foreground">{req.status}</span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(req.created_at).toLocaleDateString()} &middot; {req.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        <SheetFooter className="mt-auto pt-6 flex !flex-row !justify-between items-center sm:space-x-0 border-t border-border/50">
           <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
           </Button>
           
           <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                 Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Save Changes
              </Button>
           </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

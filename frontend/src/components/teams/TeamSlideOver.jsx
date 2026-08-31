import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateTeam, deleteTeam, assignTechnicianToTeam } from "@/api/teams";
import api from "@/api/axios";
import { Loader2, Trash2, Users, Target } from "lucide-react";
import { toast } from "sonner";

export default function TeamSlideOver({ open, setOpen, team, onSaved, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState("");

  useEffect(() => {
    if (team) {
      setName(team.name || "");
    }
  }, [team]);

  useEffect(() => {
    if (open) {
       api.get("/users/technicians").then((res) => {
           setTechnicians(res.data.data);
       });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!team) return;

    setLoading(true);
    try {
      if (name !== team.name) {
          await updateTeam(team.id, { name });
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
    if (!team) return;
    if (!confirm("Are you sure you want to delete this team? This action is irreversible.")) return;

    setLoading(true);
    try {
       await deleteTeam(team.id);
       onDelete();
       setOpen(false);
    } catch {
      // handled
    } finally {
       setLoading(false);
    }
  };

  const handleAssign = async () => {
      if (!selectedTech) return;
      try {
         await assignTechnicianToTeam(team.id, selectedTech);
         setSelectedTech("");
         onSaved(); // trigger reload to show new member
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col h-full bg-card sm:max-w-md w-full border-l border-border/50 shadow-2xl">
        <SheetHeader className="pb-4 border-b border-border/50">
          <SheetTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Manage Team
          </SheetTitle>
          <SheetDescription>Update details and members for {team?.name}.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <form id="team-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Team Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </form>

          <div className="space-y-4 pt-4 border-t border-border/50">
             <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">Team Members</h4>
             </div>
             
             {team?.technicians?.length > 0 ? (
                 <ul className="space-y-2">
                     {team.technicians.map((t) => (
                         <li key={t.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/30 border border-border/50">
                             <span className="font-medium">{t.name}</span>
                         </li>
                     ))}
                 </ul>
             ) : (
                 <div className="text-sm text-muted-foreground italic py-2">No technicians assigned.</div>
             )}

             <div className="flex gap-2 mt-4 pt-2">
                  <Select value={selectedTech} onValueChange={setSelectedTech}>
                      <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add technician..." />
                      </SelectTrigger>
                      <SelectContent>
                          {technicians.map((t) => (
                              <SelectItem key={t.id} value={String(t.id)}>
                                  {t.name}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>

                  <Button size="sm" type="button" onClick={handleAssign} disabled={!selectedTech}>
                      Assign
                  </Button>
              </div>
          </div>
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
              <Button form="team-form" type="submit" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Save Name
              </Button>
           </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

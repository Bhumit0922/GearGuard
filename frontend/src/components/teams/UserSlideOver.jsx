import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateUserRole, deleteUser } from "@/api/users";
import { Loader2, Trash2, User } from "lucide-react";

export default function UserSlideOver({ open, setOpen, user, onSaved, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setRole(user.role || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (role !== user.role) {
          await updateUserRole(user.id, role);
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
    if (!user) return;
    if (!confirm("Are you sure you want to delete this user? This action is irreversible.")) return;

    setLoading(true);
    try {
       await deleteUser(user.id);
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
            <User className="h-5 w-5 text-primary" />
            Manage User Role
          </SheetTitle>
          <SheetDescription>Update {user?.name}'s assigned role.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={user?.name || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            
          </form>
        </div>

        <SheetFooter className="mt-auto pt-6 flex !flex-row !justify-between items-center border-t border-border/50">
           <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading} className="gap-2 shrink-0">
              <Trash2 className="h-4 w-4" />
              Delete Logically
           </Button>
           
           <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                 Cancel
              </Button>
              <Button form="user-form" type="submit" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Save Role
              </Button>
           </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

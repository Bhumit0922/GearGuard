import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/api/axios";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        const user = res.data.data;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          newPassword: "",
        });
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
      };
      if (formData.newPassword) {
        payload.newPassword = formData.newPassword;
      }
      
      await api.put("/users/profile", payload);
      toast.success("Profile updated successfully!");
      setFormData(prev => ({ ...prev, newPassword: "" }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account settings and preferences"
      />

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your contact details and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label>Email (Cannot be changed)</Label>
              <Input name="email" value={formData.email} disabled className="bg-muted/50" />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
            </div>

            <div className="pt-4 border-t border-border/50 space-y-2">
              <Label>Change Password</Label>
              <Input 
                type="password" 
                name="newPassword" 
                value={formData.newPassword} 
                onChange={handleChange} 
                placeholder="Leave blank to keep current password" 
              />
              <p className="text-xs text-muted-foreground">
                Password must contain lowercase, uppercase, special character and be at least 8 characters long.
              </p>
            </div>

            <Button type="submit" disabled={saving} className="mt-4">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

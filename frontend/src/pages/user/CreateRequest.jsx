import { useEffect, useState } from "react";
import { fetchEquipment } from "@/api/equipment";
import { createRequest } from "@/api/requests";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

export default function CreateRequest() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    type: "Corrective",
    equipmentId: "",
  });

  useEffect(() => {
    fetchEquipment().then(setEquipment);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createRequest(form);

      setForm({
        subject: "",
        type: "Corrective",
        equipmentId: "",
      });

      toast.success("Maintenance request created successfully");
      navigate("/user/requests");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 pt-8">
      <PageHeader
        title="Create Maintenance Request"
        subtitle="Report an issue with equipment"
      />

      <Card className="glass-card shadow-lg border-border/50">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wrench className="h-5 w-5 text-primary" />
            Request Details
          </CardTitle>
          <CardDescription>
            Provide clear details so our technicians can address the issue efficiently.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-5">
            {/* Subject */}
            <div className="space-y-2">
              <Label className="text-foreground/80 font-medium">Issue Subject</Label>
              <Input
                required
                placeholder="e.g. Broken conveyor belt motor"
                className="bg-background/50 focus-visible:ring-primary"
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Request Type */}
              <div className="space-y-2">
                <Label className="text-foreground/80 font-medium">Request Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm({ ...form, type: v })
                  }
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Equipment */}
              <div className="space-y-2">
                <Label className="text-foreground/80 font-medium">Affected Equipment</Label>

                {equipment.length === 0 ? (
                  <p className="text-sm text-muted-foreground pt-2">
                    No equipment available.
                  </p>
                ) : (
                  <Select
                    value={form.equipmentId}
                    onValueChange={(v) =>
                      setForm({ ...form, equipmentId: v })
                    }
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>

                    <SelectContent>
                      {equipment.map((e) => (
                        <SelectItem key={e.id} value={String(e.id)}>
                          {e.name} <span className="text-muted-foreground ml-1">({e.serial_number})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-border/50 flex justify-end">
              <Button
                size="lg"
                className="w-full md:w-auto px-8"
                disabled={loading || !form.subject || !form.equipmentId}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

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
    <div className="max-w-xl space-y-6">
      <PageHeader
        title="Create Maintenance Request"
        subtitle="Report an issue with equipment"
      />

      <form onSubmit={submit} className="space-y-4">
        {/* Subject */}
        <div>
          <Label>Subject</Label>
          <Input
            required
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
          />
        </div>

        {/* Request Type */}
        <div>
          <Label>Request Type</Label>
          <Select
            value={form.type}
            onValueChange={(v) =>
              setForm({ ...form, type: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Corrective">Corrective</SelectItem>
              <SelectItem value="Preventive">Preventive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Equipment */}
        <div>
          <Label>Equipment</Label>

          {equipment.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No equipment available to report.
            </p>
          ) : (
            <Select
              value={form.equipmentId}
              onValueChange={(v) =>
                setForm({ ...form, equipmentId: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>

              <SelectContent>
                {equipment.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.name} ({e.serial_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>


        <Button
          disabled={loading || !form.subject || !form.equipmentId}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { fetchEquipment, scrapEquipment } from "@/api/equipment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/auth/useAuth";


import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEquipment()
      .then(setEquipment)
      .finally(() => setLoading(false));
  }, []);

  const handleScrap = async (id) => {
    try {
      const result = await scrapEquipment(id);

      setEquipment((prev) => prev.filter((e) => e.id !== id));

      toast.success(
        `Equipment scrapped. ${result?.closedRequests || 0} request(s) auto-closed.`
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to scrap equipment");
    }
  };

  if (loading) return <p>Loading equipment...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Equipment</h1>

      <Table>
        <TableCaption>A list of all active equipment.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Serial</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Warranty</TableHead>
            {user?.role === "manager" && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {equipment.map((item) => {
            const isUnderWarranty =
              item.warranty_expiry &&
              new Date(item.warranty_expiry) > new Date();

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.serial_number}</TableCell>
                <TableCell>{item.department || "—"}</TableCell>
                <TableCell>{item.location || "—"}</TableCell>
                <TableCell>
                  {isUnderWarranty ? (
                    <Badge className="bg-green-600 text-white">
                      Under Warranty
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Warranty Expired
                    </Badge>
                  )}
                </TableCell>

                {user?.role === "manager" && (
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleScrap(item.id)}
                    >
                      Scrap
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

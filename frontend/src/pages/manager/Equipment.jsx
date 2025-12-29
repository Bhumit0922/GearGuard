import { useEffect, useState } from "react";
import { fetchEquipment } from "@/api/equipment";
import { Badge } from "@/components/ui/badge";
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

    useEffect(() => {
        fetchEquipment()
            .then(setEquipment)
            .finally(() => setLoading(false));
    }, []);

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
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {equipment.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                {item.name}
                            </TableCell>

                            <TableCell>{item.serial_number}</TableCell>

                            <TableCell>{item.department || "—"}</TableCell>

                            <TableCell>{item.location || "—"}</TableCell>

                            <TableCell>
                                {item.isUnderWarranty ? (
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-600 text-white"
                                    >
                                        Under Warranty
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive">
                                        Warranty Expired
                                    </Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

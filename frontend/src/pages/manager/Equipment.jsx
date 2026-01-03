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
import EquipmentTableSkeleton from "@/components/equipment/EquipmentTableSkeleton";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "../../auth/useAuth";
import AssignTeamCell from "@/components/equipment/AssignTeamCell";


export default function Equipment() {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const reloadEquipment = async () => {
        const data = await fetchEquipment();
        setEquipment(data);
    };

    useEffect(() => {
        fetchEquipment()
            .then(setEquipment)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <EquipmentTableSkeleton />;
    }

    return (
        <div className="space-y-4">
            <PageHeader
                title="Equipment"
                subtitle="Manage equipment and assign maintenance teams"
            />

            <Table>
                <TableCaption>A list of all active equipment.</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Serial</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Warranty</TableHead>
                        <TableHead>Team</TableHead>
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

                                <TableCell>
                                    {user?.role === "manager" ? (
                                        <AssignTeamCell
                                            equipment={item}
                                            onUpdated={reloadEquipment}
                                        />
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            —
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>

            </Table>
        </div>
    );
}

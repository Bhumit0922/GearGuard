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
import { Card, CardContent } from "@/components/ui/card";
import EquipmentTableSkeleton from "@/components/equipment/EquipmentTableSkeleton";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "../../auth/useAuth";
import AssignTeamCell from "@/components/equipment/AssignTeamCell";
import EquipmentSlideOver from "@/components/equipment/EquipmentSlideOver";
import { Eye, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function Equipment() {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    
    // Slide-over state
    const [slideOpen, setSlideOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    const [search, setSearch] = useState("");

    const reloadEquipment = async () => {
        const data = await fetchEquipment();
        setEquipment(data);
    };

    useEffect(() => {
        let isMounted = true;
        fetchEquipment({ search: search || undefined })
            .then(data => {
                if (isMounted) setEquipment(data);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, [search]);

    const openEdit = (item) => {
        setSelectedEquipment(item);
        setSlideOpen(true);
    };

    if (loading) {
        return <EquipmentTableSkeleton />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Equipment Directory"
                subtitle="Manage equipment records and assign maintenance teams"
            />

            <div className="flex sm:items-center justify-between gap-4 glass-card p-4 rounded-xl border border-border/50 shadow-sm relative z-10">
                <input
                    type="text"
                    className="flex h-9 w-full sm:max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search equipment..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
              <Table>
                  <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                          <TableHead className="font-semibold px-6">Equipment Asset</TableHead>
                          <TableHead className="font-semibold hidden md:table-cell">Location</TableHead>
                          <TableHead className="font-semibold hidden lg:table-cell">Department</TableHead>
                          <TableHead className="font-semibold">Warranty Status</TableHead>
                          <TableHead className="font-semibold">Assigned Team</TableHead>
                          <TableHead className="font-semibold text-right pr-6">Actions</TableHead>
                      </TableRow>
                  </TableHeader>

                  <TableBody>
                      {equipment.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                  No equipment found.
                              </TableCell>
                          </TableRow>
                      ) : equipment.map((item) => {
                          const isUnderWarranty =
                              item.warranty_expiry &&
                              new Date(item.warranty_expiry) > new Date();

                          return (
                              <TableRow key={item.id} className="cursor-pointer group hover:bg-muted/30 transition-colors" onClick={() => openEdit(item)}>
                                  <TableCell className="px-6 py-4">
                                      <div className="flex flex-col">
                                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                                          <span className="text-xs text-muted-foreground font-mono mt-0.5">SN: {item.serial_number}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell text-muted-foreground">{item.location || "—"}</TableCell>
                                  <TableCell className="hidden lg:table-cell text-muted-foreground">{item.department || "—"}</TableCell>

                                  <TableCell>
                                      {isUnderWarranty ? (
                                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium hover:bg-emerald-500/20">
                                              Active
                                          </Badge>
                                      ) : (
                                          <Badge variant="outline" className="text-muted-foreground border-border font-medium">
                                              Expired
                                          </Badge>
                                      )}
                                  </TableCell>

                                  <TableCell onClick={(e) => e.stopPropagation()}>
                                      {user?.role === "manager" ? (
                                          <AssignTeamCell
                                              equipment={item}
                                              onUpdated={reloadEquipment}
                                          />
                                      ) : (
                                          <span className="text-sm font-medium text-muted-foreground">
                                              {item.team_name || "Not assigned"}
                                          </span>
                                      )}
                                  </TableCell>
                                  
                                  <TableCell className="text-right pr-6">
                                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                        <Edit2 className="h-4 w-4" />
                                     </Button>
                                  </TableCell>
                              </TableRow>
                          );
                      })}
                  </TableBody>
              </Table>
            </Card>

            <EquipmentSlideOver
               open={slideOpen}
               setOpen={setSlideOpen}
               equipment={selectedEquipment}
               onSaved={reloadEquipment}
               onDelete={reloadEquipment}
            />
        </div>
    );
}

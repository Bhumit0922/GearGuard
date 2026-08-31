import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import CreateTeamModal from "@/components/teams/CreateTeamModal";
import CreateManagerModal from "@/components/teams/CreateManagerModal";
import { fetchTeams } from "@/api/teams";
import { fetchUsers } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TeamSlideOver from "@/components/teams/TeamSlideOver";
import UserSlideOver from "@/components/teams/UserSlideOver";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShieldCheck, Edit2, Wrench } from "lucide-react";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [open, setOpen] = useState(false);
  const [openManager, setOpenManager] = useState(false);
  
  // Slide-overs
  const [teamSlideOpen, setTeamSlideOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  const [userSlideOpen, setUserSlideOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
        const [teamsData, usersData] = await Promise.all([fetchTeams(), fetchUsers()]);
        setTeams(teamsData);
        setUsers(usersData);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openTeamEdit = (team) => {
    setSelectedTeam(team);
    setTeamSlideOpen(true);
  };

  const openUserEdit = (user) => {
      setSelectedUser(user);
      setUserSlideOpen(true);
  };

  const getRoleColor = (role) => {
      switch (role) {
          case "manager": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
          case "technician": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
          default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
      }
  };

  if (loading) return <div className="p-8">Loading teams & users...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Teams & Users"
        subtitle="Manage maintenance teams, managers, and roles"
      />

      <div className="flex gap-3 mb-6">
        <Button onClick={() => setOpen(true)} className="gap-2">
           <Wrench className="h-4 w-4" />
           Create Team
        </Button>

        <Button variant="outline" onClick={() => setOpenManager(true)} className="gap-2">
          <ShieldCheck className="h-4 w-4" />
          Create Manager
        </Button>
      </div>

      <Tabs defaultValue="teams" className="w-full">
          <TabsList className="mb-4">
              <TabsTrigger value="teams" className="gap-2"><Wrench size={16}/> Teams</TabsTrigger>
              <TabsTrigger value="users" className="gap-2"><Users size={16}/> Users</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="mt-0">
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold px-6">Team Name</TableHead>
                            <TableHead className="font-semibold">Technicians count</TableHead>
                            <TableHead className="font-semibold text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                                    No teams exist yet.
                                </TableCell>
                            </TableRow>
                        ) : teams.map((team) => (
                            <TableRow key={team.id} className="cursor-pointer group hover:bg-muted/30 transition-colors" onClick={() => openTeamEdit(team)}>
                                <TableCell className="px-6 font-medium group-hover:text-primary transition-colors">
                                    {team.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {team.technicians?.length || 0} Members
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary pointer-events-none">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-0">
             <Card className="border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold px-6">Name</TableHead>
                            <TableHead className="font-semibold">Email</TableHead>
                            <TableHead className="font-semibold">Role</TableHead>
                            <TableHead className="font-semibold text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : users.map((user) => (
                            <TableRow key={user.id} className="cursor-pointer group hover:bg-muted/30 transition-colors" onClick={() => openUserEdit(user)}>
                                <TableCell className="px-6 font-medium group-hover:text-primary transition-colors">
                                    {user.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`font-medium capitalize ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary pointer-events-none">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </Card>
          </TabsContent>
      </Tabs>

      {/* 🧩 MODALS & SLIDE-OVERS */}
      <CreateTeamModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={loadData}
      />

      <CreateManagerModal
        open={openManager}
        onClose={() => setOpenManager(false)}
      />

      <TeamSlideOver
        open={teamSlideOpen}
        setOpen={setTeamSlideOpen}
        team={selectedTeam}
        onSaved={loadData}
        onDelete={loadData}
      />

      <UserSlideOver
         open={userSlideOpen}
         setOpen={setUserSlideOpen}
         user={selectedUser}
         onSaved={loadData}
         onDelete={loadData}
      />
    </div>
  );
}

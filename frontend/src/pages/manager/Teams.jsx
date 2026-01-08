import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import TeamCard from "@/components/teams/TeamCard";
import CreateTeamModal from "@/components/teams/CreateTeamModal";
import CreateManagerModal from "@/components/teams/CreateManagerModal";
import { fetchTeams } from "@/api/teams";
import { Button } from "@/components/ui/button";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [openManager, setOpenManager] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const data = await fetchTeams();
      if (mounted) setTeams(data);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        subtitle="Manage maintenance teams and technicians"
      />

      {/* 🔘 ACTION BUTTONS */}
      <div className="flex gap-3">
        <Button onClick={() => setOpen(true)}>Create Team</Button>

        <Button
          variant="outline"
          onClick={() => setOpenManager(true)}
        >
          Create Manager
        </Button>
      </div>

      {/* 🧩 TEAM LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onUpdated={() => {
              fetchTeams().then(setTeams);
            }}
          />
        ))}
      </div>

      {/* 🧩 MODALS */}
      <CreateTeamModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => fetchTeams().then(setTeams)}
      />

      <CreateManagerModal
        open={openManager}
        onClose={() => setOpenManager(false)}
      />
    </div>
  );
}

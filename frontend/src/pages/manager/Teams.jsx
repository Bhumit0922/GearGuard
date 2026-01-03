import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import TeamCard from "@/components/teams/TeamCard";
import CreateTeamModal from "@/components/teams/CreateTeamModal";
import { fetchTeams } from "@/api/teams";
import { Button } from "@/components/ui/button";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);

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

      <Button onClick={() => setOpen(true)}>Create Team</Button>

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

      <CreateTeamModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          fetchTeams().then(setTeams);
        }}
      />
    </div>
  );
}

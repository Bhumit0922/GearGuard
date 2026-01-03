import api from "@/api/axios";
import { toast } from "sonner";

/* ---------------- TEAMS ---------------- */

export const fetchTeams = async () => {
  try {
    const res = await api.get("/teams");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load teams");
    throw err;
  }
};

export const createTeam = async (name) => {
  try {
    const res = await api.post("/teams", { name });
    toast.success("Team created successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to create team");
    throw err;
  }
};

export const assignTechnicianToTeam = async (teamId, technicianId) => {
  try {
    const res = await api.patch(`/teams/${teamId}/assign`, { technicianId });
    toast.success("Technician assigned to team");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to assign technician");
    throw err;
  }
};

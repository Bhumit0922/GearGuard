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

export const updateTeam = async (id, data) => {
  try {
    const res = await api.patch(`/teams/${id}`, data);
    toast.success("Team updated successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to update team");
    throw err;
  }
};

export const deleteTeam = async (id) => {
  try {
    const res = await api.delete(`/teams/${id}`);
    toast.success("Team deleted successfully");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to delete team");
    throw err;
  }
};

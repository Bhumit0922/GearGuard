import api from "@/api/axios";
import { toast } from "sonner";

export const fetchEquipment = async () => {
  try {
    const res = await api.get("/equipment");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load equipment");
    throw err;
  }
};

export const scrapEquipment = async (id) => {
  try {
    const res = await api.patch(`/equipment/${id}/scrap`);
    toast.warning("Equipment scrapped successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to scrap equipment");
    throw err;
  }
};

export const assignEquipmentTeam = async (equipmentId, teamId) => {
  try {
    const res = await api.patch(`/equipment/${equipmentId}/assign-team`, {
      teamId,
    });
    toast.success("Team assigned successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to assign team");
    throw err;
  }
};

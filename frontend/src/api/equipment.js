import api from "@/api/axios";
import { toast } from "sonner";

export const fetchEquipment = async (params = {}) => {
  try {
    const res = await api.get("/equipment", { params });
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

export const updateEquipment = async (id, data) => {
  try {
    const res = await api.put(`/equipment/${id}`, data);
    toast.success("Equipment updated successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to update equipment");
    throw err;
  }
};

export const deleteEquipment = async (id) => {
  try {
    const res = await api.delete(`/equipment/${id}`);
    toast.success("Equipment deleted successfully");
    return res.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to delete equipment");
    throw err;
  }
};

export const fetchEquipmentHistory = async (id) => {
  try {
    const res = await api.get(`/equipment/${id}/history`);
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load equipment history");
    throw err;
  }
};

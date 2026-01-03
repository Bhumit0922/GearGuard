import api from "@/api/axios";
import { toast } from "sonner";

export const fetchManagerDashboard = async () => {
  try {
    const res = await api.get("/dashboard/manager");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to load manager dashboard");
    throw err;
  }
};

export const fetchTechnicianDashboard = async () => {
  try {
    const res = await api.get("/dashboard/technician");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to load technician dashboard");
    throw err;
  }
};

export const fetchUserDashboard = async () => {
  try {
    const res = await api.get("/dashboard/user");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to load user dashboard");
    throw err;
  }
};

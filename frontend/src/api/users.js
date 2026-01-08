import api from "@/api/axios";
import { toast } from "sonner";

export const createManager = async (payload) => {
  try {
    const res = await api.post("/users/managers", payload);
    toast.success("Manager created successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to create manager");
    throw err;
  }
};

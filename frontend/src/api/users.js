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

export const fetchUsers = async () => {
    try {
        const res = await api.get("/users");
        return res.data.data;
    } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load users");
        throw err;
    }
};

export const updateUserRole = async (id, role) => {
    try {
        const res = await api.patch(`/users/${id}`, { role });
        toast.success("User role updated successfully");
        return res.data.data;
    } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to update role");
        throw err;
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await api.delete(`/users/${id}`);
        toast.success("User deleted successfully");
        return res.data;
    } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete user");
        throw err;
    }
};

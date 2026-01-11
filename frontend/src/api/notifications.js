import api from "@/api/axios";
import { toast } from "sonner";

export const fetchNotifications = async () => {
  try {
    const res = await api.get("/notifications");
    return res.data?.data ?? [];
  } catch (err) {
    // 🔕 Silently ignore auth / server issues
    if (
      err.response?.status === 401 ||
      err.response?.status === 403 ||
      err.response?.status === 500 ||
      err.response?.data?.message === "Authorization token missing"
    ) {
      return [];
    }

    toast.error("Failed to load notifications");
    return [];
  }
};


export const markNotificationRead = async (id) => {
  try {
    await api.patch(`/notifications/${id}/read`);
  } catch {
    toast.error("Failed to mark notification as read");
  }
};

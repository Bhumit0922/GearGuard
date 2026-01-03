import api from "@/api/axios";
import { toast } from "sonner";

export const fetchRequests = async () => {
  try {
    const res = await api.get("/requests");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load requests");
    throw err;
  }
};

export const updateRequestStatus = async (id, status) => {
  try {
    const res = await api.patch(`/requests/${id}/status`, { status });
    toast.success(`Request moved to "${status}"`);
    return res.data.data;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to update request status"
    );
    throw err;
  }
};

export const assignTechnician = async (id, technicianId) => {
  try {
    const res = await api.patch(`/requests/${id}/assign`, { technicianId });
    toast.success("Technician assigned successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to assign technician");
    throw err;
  }
};

export const scrapRequest = async (id) => {
  try {
    const res = await api.patch(`/requests/${id}/scrap`);
    toast.warning("Request and equipment scrapped");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to scrap request");
    throw err;
  }
};

/* ---------------- REQUEST DETAILS ---------------- */

export const fetchRequestDetails = async (id) => {
  try {
    const res = await api.get(`/requests/${id}`);
    return res.data.data;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to load request details"
    );
    throw err;
  }
};

export const fetchRequestLogs = async (id) => {
  try {
    const res = await api.get(`/requests/${id}/logs`);
    return res.data.data;
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to load request history"
    );
    throw err;
  }
};

/* ---------------- TECHNICIAN ACTIONS ---------------- */

export const completeRequest = async (id, durationHours) => {
  try {
    const res = await api.patch(`/requests/${id}/complete`, {
      durationHours,
    });

    toast.success("Request marked as completed");
    return res.data.data;
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to complete request");
    throw err;
  }
};

export const createRequest = async (payload) => {
  try {
    const res = await api.post("/requests", payload);
    toast.success("Maintenance request submitted");
    return res.data.data;
  } catch (err) {
    toast.error(err.message || "Failed to submit request");
    throw err;
  }
};

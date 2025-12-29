import axios from "@/api/axios";

/**
 * GET /api/requests
 * Backend auto-filters by:
 * - role
 * - team
 * - creator
 */
export const fetchRequests = async () => {
  const res = await axios.get("/requests");
  return res.data.data;
};

/**
 * PATCH /api/requests/:id/status
 */
export const updateRequestStatus = async (id, status) => {
  return axios.patch(`/requests/${id}/status`, { status });
};

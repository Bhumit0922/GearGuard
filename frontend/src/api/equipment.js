import axios from "@/api/axios";

/**
 * GET /api/equipment
 * Backend already:
 * - filters scrapped equipment
 * - computes isUnderWarranty
 */
export const fetchEquipment = async () => {
  const res = await axios.get("/equipment");
  return res.data.data; // ApiResponse -> { success, data }
};

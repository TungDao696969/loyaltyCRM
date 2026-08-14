import axiosInstance from '@/lib/axios';
import { Store } from '@/types/store';

export const storeService = {
  getStores: async (activeTab: "active" | "trash" = "active"): Promise<Store[]> => {
    const res = await axiosInstance.get(`/stores${activeTab === "trash" ? "?is_deleted=true" : ""}`);
    return res.data.data;
  },

  createStore: async (data: Record<string, unknown>) => {
    const res = await axiosInstance.post('/stores', data);
    return res.data;
  },

  updateStore: async (id: number, data: Record<string, unknown>) => {
    const res = await axiosInstance.put(`/stores/${id}`, data);
    return res.data;
  },

  deleteStore: async (id: number) => {
    const res = await axiosInstance.delete(`/stores/${id}`);
    return res.data;
  },

  restoreStore: async (id: number) => {
    const res = await axiosInstance.put(`/stores/${id}/restore`);
    return res.data;
  }
};

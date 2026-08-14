import axiosInstance from '@/lib/axios';
import { Tier } from '@/types/tier';

export const tierService = {
  getTiers: async (): Promise<Tier[]> => {
    const res = await axiosInstance.get('/tiers');
    return res.data.data;
  },

  createTier: async (data: Record<string, unknown>) => {
    const res = await axiosInstance.post('/tiers', data);
    return res.data.data;
  },

  updateTier: async (id: number, data: Record<string, unknown>) => {
    const res = await axiosInstance.put(`/tiers/${id}`, data);
    return res.data.data;
  },

  deleteTier: async (id: number) => {
    const res = await axiosInstance.delete(`/tiers/${id}`);
    return res.data;
  }
};

import axiosInstance from '@/lib/axios';
import { CustomerSegment, Campaign } from '@/types/crm';

export const crmService = {
  // --- Segments ---
  getSegments: async (): Promise<CustomerSegment[]> => {
    const res = await axiosInstance.get('/segments');
    return res.data.data;
  },

  createSegment: async (data: Record<string, unknown>) => {
    const res = await axiosInstance.post('/segments', data);
    return res.data.data;
  },

  updateSegment: async (id: string, data: Record<string, unknown>) => {
    const res = await axiosInstance.put(`/segments/${id}`, data);
    return res.data.data;
  },

  deleteSegment: async (id: string) => {
    const res = await axiosInstance.delete(`/segments/${id}`);
    return res.data;
  },

  getSegmentCustomers: async (id: string) => {
    const res = await axiosInstance.get(`/segments/${id}/customers`);
    return res.data; // { data: [...], count: X }
  },

  // --- Campaigns ---
  getCampaigns: async (): Promise<Campaign[]> => {
    const res = await axiosInstance.get('/campaigns');
    return res.data.data;
  },

  createCampaign: async (data: Record<string, unknown>) => {
    const res = await axiosInstance.post('/campaigns', data);
    return res.data.data;
  },

  updateCampaign: async (id: string, data: Record<string, unknown>) => {
    const res = await axiosInstance.put(`/campaigns/${id}`, data);
    return res.data.data;
  },

  deleteCampaign: async (id: string) => {
    const res = await axiosInstance.delete(`/campaigns/${id}`);
    return res.data;
  },

  sendCampaign: async (id: string) => {
    const res = await axiosInstance.post(`/campaigns/${id}/send`);
    return res.data;
  }
};

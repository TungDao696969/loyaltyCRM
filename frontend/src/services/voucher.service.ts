import axiosInstance from '@/lib/axios';
import { Voucher } from '@/types/voucher';

export const voucherService = {
  getVouchers: async (): Promise<Voucher[]> => {
    const res = await axiosInstance.get('/vouchers');
    return res.data.data;
  },

  createVoucher: async (data: Record<string, unknown>) => {
    const res = await axiosInstance.post('/vouchers', data);
    return res.data.data;
  },

  updateVoucher: async (id: string, data: Record<string, unknown>) => {
    const res = await axiosInstance.put(`/vouchers/${id}`, data);
    return res.data.data;
  },

  deleteVoucher: async (id: string) => {
    const res = await axiosInstance.delete(`/vouchers/${id}`);
    return res.data;
  },

  getRewards: async () => {
    const res = await axiosInstance.get('/vouchers/rewards/catalog');
    return res.data.data;
  },

  exchangeVoucher: async (data: { customer_id: string, reward_id: string }) => {
    const res = await axiosInstance.post('/vouchers/exchange', data);
    return res.data.data;
  },

  checkVoucher: async (data: { voucher_code: string, customer_id?: string, order_amount?: number }) => {
    const res = await axiosInstance.post('/vouchers/check', data);
    return res.data.data;
  }
};

import axiosInstance from '@/lib/axios';
import { Transaction } from '@/types/transaction';

export const transactionService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const res = await axiosInstance.get('/transactions');
    return res.data.data;
  },

  getCustomerTransactions: async (customerId: string): Promise<Transaction[]> => {
    const res = await axiosInstance.get(`/customers/${customerId}/transactions`);
    return res.data.data;
  },

  createTransaction: async (data: Record<string, unknown>) => {
    const res = await axiosInstance.post('/transactions', data);
    return res.data.data;
  },

  updateTransaction: async (id: string, data: Record<string, unknown>) => {
    const res = await axiosInstance.put(`/transactions/${id}`, data);
    return res.data.data;
  },

  deleteTransaction: async (id: string) => {
    const res = await axiosInstance.delete(`/transactions/${id}`);
    return res.data;
  }
};

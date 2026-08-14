import axiosInstance from "@/lib/axios";
import { Customer } from "@/types/customer";
import { CustomerFilter } from "@/types/customer";
export const customerService = {
  getCustomers: async (
    params: CustomerFilter = {},
  ): Promise<Customer[]> => {
    // Axios sẽ tự động map object params thành chuỗi query trên URL
    const res = await axiosInstance.get(`/customers`, { params });
    return res.data.data;
  },

  getCustomerByPhone: async (phone: string): Promise<Customer> => {
    const res = await axiosInstance.get(`/customers/phone/${phone}`);
    return res.data.data;
  },

  createCustomer: async (data: Record<string, unknown>) => {
    const res = await axiosInstance.post("/customers", data);
    return res.data;
  },

  updateCustomer: async (id: string, data: Record<string, unknown>) => {
    const res = await axiosInstance.put(`/customers/${id}`, data);
    return res.data;
  },

  deleteCustomer: async (id: string) => {
    const res = await axiosInstance.delete(`/customers/${id}`);
    return res.data;
  },

  restoreCustomer: async (id: string) => {
    const response = await axiosInstance.put(`/customers/${id}/restore`);
    return response.data.data;
  },
  addSpent: async (id: string, amount: number) => {
    const response = await axiosInstance.post(`/customers/${id}/add-spent`, {
      amount,
    });
    return response.data.data;
  },
};

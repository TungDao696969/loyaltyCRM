import axiosInstance from '@/lib/axios';
import { Order } from '@/types/order';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  if (!customerId) return [];
  const response = await axiosInstance.get(`/orders/customer/${customerId}`);
  return response.data.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get('/orders');
  return response.data.data;
};

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  const response = await axiosInstance.post('/orders', orderData);
  return response.data.data;
};

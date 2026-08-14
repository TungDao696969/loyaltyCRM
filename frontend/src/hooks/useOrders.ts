import { useQuery } from '@tanstack/react-query';
import { getCustomerOrders, getAllOrders } from '@/services/order.service';
import { Order } from '@/types/order';

export const useCustomerOrders = (customerId?: string | null) => {
  const { data: orders = [], isLoading, error, refetch } = useQuery<Order[]>({
    queryKey: ['customer-orders', customerId],
    queryFn: () => getCustomerOrders(customerId as string),
    enabled: !!customerId,
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
  };
};

export const useAllOrders = () => {
  const { data: orders = [], isLoading, error, refetch } = useQuery<Order[]>({
    queryKey: ['all-orders'],
    queryFn: () => getAllOrders(),
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
  };
};

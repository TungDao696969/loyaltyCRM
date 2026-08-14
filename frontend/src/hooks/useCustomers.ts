import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customer.service";
import { toast } from "react-hot-toast";
import { CustomerFilter } from "@/types/customer";
export const useCustomers = (filters: CustomerFilter = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["customers", filters],
    queryFn: () => customerService.getCustomers(filters),
  });

  const createMutation = useMutation({
    mutationFn: customerService.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created successfully");
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to create customer",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to update customer",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted successfully");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: customerService.restoreCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer restored successfully");
    },
  });

  return {
    customers: query.data || [],
    isLoading: query.isLoading,
    createCustomer: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateCustomer: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteCustomer: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    restoreCustomer: restoreMutation.mutate,
    isRestoring: restoreMutation.isPending,
  };
};

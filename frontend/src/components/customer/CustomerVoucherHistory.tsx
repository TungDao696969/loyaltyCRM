"use client";

import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customer.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerVoucherHistory as HistoryType } from "@/types/customer";

export default function CustomerVoucherHistory({ customerId }: { customerId: string }) {
  const { data: vouchers, isLoading, error } = useQuery({
    queryKey: ["customer-vouchers", customerId],
    queryFn: () => customerService.getCustomerVouchersHistory(customerId),
    enabled: !!customerId,
  });

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-gray-500">Đang tải lịch sử voucher...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-sm text-red-500">Đã xảy ra lỗi khi tải dữ liệu voucher.</div>;
  }

  if (!vouchers || vouchers.length === 0) {
    return <div className="p-4 text-center text-sm text-gray-500">Khách hàng chưa sở hữu voucher nào.</div>;
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "used":
        return "bg-blue-100 text-blue-700";
      case "expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatCurrency = (value: string | number) => {
    return Number(value).toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã Voucher</TableHead>
            <TableHead>Từ chiến dịch</TableHead>
            <TableHead>Giảm giá</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hạn sử dụng</TableHead>
            <TableHead>Ngày dùng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers.map((item: HistoryType) => (
            <TableRow key={item.voucher_id}>
              <TableCell className="font-medium">
                {item.voucher_code}
              </TableCell>
              <TableCell>
                {item.campaign?.campaign_name || "Hệ thống"}
              </TableCell>
              <TableCell>
                {item.voucher_type === "PERCENT" ? `${item.discount_value}%` : formatCurrency(item.discount_value)}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                  {item.status || "N/A"}
                </span>
              </TableCell>
              <TableCell>
                {item.expired_at ? new Date(item.expired_at).toLocaleDateString("vi-VN") : "-"}
              </TableCell>
              <TableCell>
                {item.used_at ? new Date(item.used_at).toLocaleDateString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit"
                }) : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

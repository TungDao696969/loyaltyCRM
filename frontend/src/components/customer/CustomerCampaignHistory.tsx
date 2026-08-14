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
import { CustomerCampaignHistory as HistoryType } from "@/types/customer";

export default function CustomerCampaignHistory({ customerId }: { customerId: string }) {
  const { data: history, isLoading, error } = useQuery({
    queryKey: ["customer-campaigns", customerId],
    queryFn: () => customerService.getCustomerCampaignHistory(customerId),
    enabled: !!customerId,
  });

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-gray-500">Đang tải lịch sử chiến dịch...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-sm text-red-500">Đã xảy ra lỗi khi tải dữ liệu.</div>;
  }

  if (!history || history.length === 0) {
    return <div className="p-4 text-center text-sm text-gray-500">Khách hàng chưa tham gia chiến dịch nào.</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên chiến dịch</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tham gia</TableHead>
            <TableHead>Lỗi (nếu có)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item: HistoryType) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.campaign?.campaign_name || "N/A"}
              </TableCell>
              <TableCell className="capitalize">{item.campaign?.channel || "N/A"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleDateString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </TableCell>
              <TableCell className="text-red-500 max-w-[200px] truncate" title={item.error_message || ""}>
                {item.error_message || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

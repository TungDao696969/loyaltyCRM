"use client";

import { useState } from "react";
import { useCRM } from "@/hooks/useCRM";
import { CustomerSegment } from "@/types/crm";
import { crmService } from "@/services/crm.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Users, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function SegmentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editSegment, setEditSegment] = useState<CustomerSegment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // States for matching customers preview
  const [matchingCount, setMatchingCount] = useState<number | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const {
    segments,
    isLoadingSegments,
    createSegment,
    isCreatingSegment,
    updateSegment,
    isUpdatingSegment,
    deleteSegment,
    isDeletingSegment,
  } = useCRM();

  const { register, handleSubmit, reset, watch, getValues } = useForm({
    defaultValues: {
      segment_name: "",
      minR: "",
      maxR: "",
      minF: "",
      maxF: "",
      minM: "",
      maxM: "",
    },
  });

  const onSubmit = (data: any) => {
    // Build rfm_criteria json
    const rfm_criteria: any = {};
    if (data.minR) rfm_criteria.minR = Number(data.minR);
    if (data.maxR) rfm_criteria.maxR = Number(data.maxR);
    if (data.minF) rfm_criteria.minF = Number(data.minF);
    if (data.maxF) rfm_criteria.maxF = Number(data.maxF);
    if (data.minM) rfm_criteria.minM = Number(data.minM);
    if (data.maxM) rfm_criteria.maxM = Number(data.maxM);

    const formattedData = {
      segment_name: data.segment_name,
      rfm_criteria,
    };

    if (editSegment) {
      updateSegment(
        { id: String(editSegment.segment_id), data: formattedData },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            reset(); 
          },
        },
      );
    } else {
      createSegment(formattedData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        },
      });
    }
  };

  const handleOpenCreate = () => {
    setEditSegment(null);
    setMatchingCount(null);
    reset({
      segment_name: "",
      minR: "",
      maxR: "",
      minF: "",
      maxF: "",
      minM: "",
      maxM: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (segment: CustomerSegment) => {
    setEditSegment(segment);
    setMatchingCount(null);
    const rfm = segment.rfm_criteria || {};
    reset({
      segment_name: segment.segment_name,
      minR: rfm.minR?.toString() || "",
      maxR: rfm.maxR?.toString() || "",
      minF: rfm.minF?.toString() || "",
      maxF: rfm.maxF?.toString() || "",
      minM: rfm.minM?.toString() || "",
      maxM: rfm.maxM?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const checkMatchingCustomers = async (segmentId: number) => {
    setIsPreviewing(true);
    try {
      const res = await crmService.getSegmentCustomers(String(segmentId));
      toast.success(`Có ${res.count} khách hàng thuộc nhóm này!`);
    } catch (e) {
      toast.error("Lỗi khi tải danh sách khách hàng");
    } finally {
      setIsPreviewing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-fuchsia-500" />
            Nhóm Khách Hàng (Segments)
          </h1>
          <p className="mt-1 text-slate-500">
            Phân loại khách hàng theo mô hình RFM để phục vụ Marketing.
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditSegment(null);
              reset();
            }
          }}
        >
          <DialogTrigger render={<Button
              onClick={handleOpenCreate}
              className="group relative overflow-hidden bg-fuchsia-500 text-white hover:bg-fuchsia-600 shadow-lg shadow-fuchsia-500/30"
            />}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
              <Plus className="mr-2 h-4 w-4" /> <span>Tạo Nhóm Mới</span>
          </DialogTrigger>
          <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[500px] rounded-2xl shadow-2xl shadow-slate-200/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-fuchsia-500" />
                {editSegment ? "Cập nhật Nhóm" : "Tạo mới Nhóm Khách Hàng"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">
                  Tên Nhóm (Segment Name) *
                </Label>
                <Input
                  placeholder="Ví dụ: Khách VIP mua thường xuyên"
                  className="border-slate-200 focus-visible:ring-fuchsia-500"
                  {...register("segment_name", { required: true })}
                />
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-800">
                  Cấu hình Bộ lọc RFM (Để trống nếu không lọc)
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">
                      Recency (R) - Số ngày chưa mua: MIN
                    </Label>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 0"
                      className="border-slate-200 focus-visible:ring-fuchsia-500"
                      {...register("minR")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">
                      Recency (R) - Số ngày chưa mua: MAX
                    </Label>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 30"
                      className="border-slate-200 focus-visible:ring-fuchsia-500"
                      {...register("maxR")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">
                      Frequency (F) - Tổng số đơn: MIN
                    </Label>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 5"
                      className="border-slate-200 focus-visible:ring-fuchsia-500"
                      {...register("minF")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">
                      Frequency (F) - Tổng số đơn: MAX
                    </Label>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 100"
                      className="border-slate-200 focus-visible:ring-fuchsia-500"
                      {...register("maxF")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">
                      Monetary (M) - Tổng chi tiêu: MIN
                    </Label>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 10000000"
                      className="border-slate-200 focus-visible:ring-fuchsia-500"
                      {...register("minM")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">
                      Monetary (M) - Tổng chi tiêu: MAX
                    </Label>
                    <Input
                      type="number"
                      placeholder="Để trống là không giới hạn"
                      className="border-slate-200 focus-visible:ring-fuchsia-500"
                      {...register("maxM")}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-fuchsia-600 text-white hover:bg-fuchsia-700 mt-4 rounded-xl"
                disabled={isCreatingSegment || isUpdatingSegment}
              >
                {isCreatingSegment || isUpdatingSegment
                  ? "Đang lưu..."
                  : "Lưu Nhóm"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 w-16">
                ID
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Tên Nhóm (Segment)
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Tiêu chí (RFM Criteria)
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Ngày tạo
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingSegments ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-500 py-12"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : segments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-500 py-12"
                >
                  Chưa có phân nhóm nào.
                </TableCell>
              </TableRow>
            ) : (
              segments.map((segment) => (
                <TableRow
                  key={segment.segment_id}
                  className="border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-slate-500">
                    #{segment.segment_id}
                  </TableCell>
                  <TableCell className="font-bold text-fuchsia-600">
                    {segment.segment_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {segment.rfm_criteria &&
                      Object.keys(segment.rfm_criteria).length > 0 ? (
                        Object.entries(segment.rfm_criteria).map(([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                          >
                            {k}: {v}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Không có bộ lọc (Tất cả KH)
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {segment.created_at
                      ? new Date(segment.created_at).toLocaleDateString("vi-VN")
                      : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                        onClick={() =>
                          checkMatchingCustomers(segment.segment_id)
                        }
                        disabled={isPreviewing}
                      >
                        <Search className="h-4 w-4 mr-1" /> Test Phễu
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-fuchsia-600 hover:bg-fuchsia-50"
                        onClick={() => handleOpenEdit(segment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => setDeleteTarget(segment.segment_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-[425px] rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Xác nhận xóa
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-500 text-sm">
            Xóa nhóm này sẽ không xóa khách hàng, nhưng các chiến dịch đang gắn
            với nhóm này có thể bị ảnh hưởng. Bạn có chắc chắn xóa?
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              className="bg-rose-500 text-white hover:bg-rose-600"
              onClick={() => {
                if (deleteTarget)
                  deleteSegment(String(deleteTarget), {
                    onSuccess: () => setDeleteTarget(null),
                  });
              }}
              disabled={isDeletingSegment}
            >
              {isDeletingSegment ? "Đang xóa..." : "Xóa Nhóm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomerTransactions } from "@/hooks/useTransactions";
import { useCustomerOrders } from "@/hooks/useOrders";
import { Customer } from "@/types/customer";
import { Transaction } from "@/types/transaction";
import { Order } from "@/types/order";

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
import { Plus, Trash2, Edit, Eye, ArchiveRestore, Search } from "lucide-react";
import { useForm } from "react-hook-form";

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "trash">("active");
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [detailTab, setDetailTab] = useState<"points" | "orders">("points");
  const [filterName, setFilterName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  const queryFilters = {
    is_deleted: activeTab === "trash" ? true : false,
    ...(filterName && { full_name: filterName }),
    ...(filterPhone && { phone_number: filterPhone }),
    ...(filterStatus && { status: filterStatus }),
    ...(filterEmail && { email: filterEmail }),
  };

  const {
    customers,
    isLoading,
    createCustomer,
    isCreating,
    updateCustomer,
    isUpdating,
    deleteCustomer,
    isDeleting,
    restoreCustomer,
    isRestoring,
  } = useCustomers(queryFilters);

  const { transactions: customerTransactions, isLoading: isLoadingTx } =
    useCustomerTransactions(viewCustomer?.customer_id);

  const { orders: customerOrders, isLoading: isLoadingOrders } =
    useCustomerOrders(viewCustomer?.customer_id);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: Record<string, unknown>) => {
    if (editCustomer) {
      updateCustomer(
        { id: editCustomer.customer_id, data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            reset();
          },
        },
      );
    } else {
      createCustomer(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        },
      });
    }
  };

  const handleOpenCreate = () => {
    setEditCustomer(null);
    reset({
      phone_number: "",
      full_name: "",
      email: "",
      gender: "",
      date_of_birth: "",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditCustomer(customer);
    reset({
      phone_number: customer.phone_number,
      full_name: customer.full_name,
      email: customer.email || "",
      gender: customer.gender || "",
      date_of_birth: customer.date_of_birth
        ? customer.date_of_birth.split("T")[0]
        : "",
      status: customer.status,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Customers
          </h1>
          <p className="mt-1 text-slate-500">
            Manage your CRM customers and profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full justify-end">
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tên khách hàng..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="pl-9 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
              />
            </div>
            
            <div className="relative w-full sm:w-48">
              <Input
                placeholder="Số điện thoại..."
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
                className="border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
              />
            </div>
            
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus-visible:ring-indigo-500 outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>

            {(filterName || filterPhone || filterStatus || filterEmail) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setFilterName("");
                  setFilterPhone("");
                  setFilterStatus("");
                  setFilterEmail("");
                }}
                className="text-slate-500 hover:text-rose-500"
              >
                Xóa lọc
              </Button>
            )}
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditCustomer(null);
                reset();
              }
            }}
          >
            <DialogTrigger
              render={
                <Button
                  onClick={handleOpenCreate}
                  className="group relative overflow-hidden bg-indigo-500 text-slate-900 hover:bg-indigo-600"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                  <Plus className="mr-2 h-4 w-4 text-white" />{" "}
                  <span className="text-white">Add Customer</span>
                </Button>
              }
            />
            <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
              <DialogHeader>
                <DialogTitle className="text-xl text-slate-900">
                  {editCustomer ? "Edit customer" : "Create new customer"}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
              >
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">
                    Phone Number *
                  </Label>
                  <Input
                    className="border-slate-200 bg-white focus-visible:ring-indigo-500"
                    {...register("phone_number", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">
                    Full Name *
                  </Label>
                  <Input
                    className="border-slate-200 bg-white focus-visible:ring-indigo-500"
                    {...register("full_name", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">
                    Email
                  </Label>
                  <Input
                    type="email"
                    className="border-slate-200 bg-white focus-visible:ring-indigo-500"
                    {...register("email")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-500">
                      Gender
                    </Label>
                    <select
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:ring-indigo-500 outline-none"
                      {...register("gender")}
                    >
                      <option value="" className="bg-white">
                        None
                      </option>
                      <option value="Male" className="bg-white">
                        Male
                      </option>
                      <option value="Female" className="bg-white">
                        Female
                      </option>
                      <option value="Other" className="bg-white">
                        Other
                      </option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-500">
                      Date of Birth
                    </Label>
                    <Input
                      type="date"
                      className="border-slate-200 bg-white focus-visible:ring-indigo-500"
                      {...register("date_of_birth")}
                    />
                  </div>
                </div>

                {editCustomer && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-slate-500">
                      Status
                    </Label>
                    <select
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:ring-indigo-500 outline-none"
                      {...register("status", { required: true })}
                    >
                      <option value="active" className="bg-white">
                        Active
                      </option>
                      <option value="inactive" className="bg-white">
                        Inactive
                      </option>
                      <option value="banned" className="bg-white">
                        Banned
                      </option>
                    </select>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 mt-4"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? "Saving..." : "Save Customer"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "active"
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Hoạt động
        </button>
        <button
          onClick={() => setActiveTab("trash")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "trash"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Thùng rác
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white backdrop-blur-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Phone
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Points
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-500 py-8"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-500 py-8"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.customer_id}
                  className="border-slate-100 transition-colors hover:bg-white"
                >
                  <TableCell className="font-medium text-slate-900">
                    {customer.phone_number}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {customer.full_name}
                  </TableCell>
                  <TableCell className="text-indigo-400 font-semibold">
                    {customer.total_points}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${customer.status === "active" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-400"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${customer.status === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-rose-500"}`}
                      />
                      {customer.status?.toUpperCase() || "UNKNOWN"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        onClick={() => setViewCustomer(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {activeTab === "active" ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            onClick={() => handleOpenEdit(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            onClick={() =>
                              setDeleteTarget(customer.customer_id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                          onClick={() => setRestoreTarget(customer.customer_id)}
                          title="Restore"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
        <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[750px] rounded-2xl shadow-2xl shadow-slate-200/50">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900">
              Thông tin Khách hàng
            </DialogTitle>
          </DialogHeader>
          {viewCustomer && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="grid grid-cols-3 border-b border-slate-200 pb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 self-center">
                    Phone
                  </span>
                  <span className="col-span-2 font-medium text-slate-900">
                    {viewCustomer.phone_number}
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 pb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 self-center">
                    Full Name
                  </span>
                  <span className="col-span-2 text-slate-700">
                    {viewCustomer.full_name}
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 pb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 self-center">
                    Email
                  </span>
                  <span className="col-span-2 text-slate-500">
                    {viewCustomer.email || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 pb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 self-center">
                    Gender
                  </span>
                  <span className="col-span-2 text-slate-500">
                    {viewCustomer.gender || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 pb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 self-center">
                    Date of Birth
                  </span>
                  <span className="col-span-2 text-slate-500">
                    {viewCustomer.date_of_birth
                      ? new Date(
                          viewCustomer.date_of_birth,
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 pb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 self-center">
                    Total Points
                  </span>
                  <span className="col-span-2 font-bold text-indigo-500">
                    {viewCustomer.total_points}
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 pb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 self-center">
                    Total Spent
                  </span>
                  <span className="col-span-2 font-bold text-emerald-500">
                    {Number(viewCustomer.total_spent).toLocaleString()}đ
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200 pb-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 self-center">
                    Tier
                  </span>
                  <span className="col-span-2 font-bold text-amber-500">
                    {viewCustomer.tier?.tier_name || "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="flex border-b border-slate-200 mb-4">
                  <button
                    onClick={() => setDetailTab("points")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${detailTab === "points" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                  >
                    Lịch sử Giao dịch điểm
                  </button>
                  <button
                    onClick={() => setDetailTab("orders")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${detailTab === "orders" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                  >
                    Lịch sử Hóa đơn
                  </button>
                </div>
                
                {detailTab === "points" ? (
                  <div className="max-h-[250px] overflow-y-auto rounded-xl border border-slate-200">
                  <Table>
                    <TableHeader className="bg-slate-50 sticky top-0">
                      <TableRow>
                        <TableHead className="text-xs font-semibold uppercase text-slate-700">
                          Ngày
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-slate-700">
                          Loại
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-slate-700 text-right">
                          Chi tiêu
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-slate-700 text-right">
                          Điểm
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-slate-700 text-right">
                          Chi tiết
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingTx ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-4 text-slate-500"
                          >
                            Đang tải...
                          </TableCell>
                        </TableRow>
                      ) : customerTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-4 text-slate-500"
                          >
                            Chưa có giao dịch nào.
                          </TableCell>
                        </TableRow>
                      ) : (
                        customerTransactions.map((tx: Transaction) => (
                          <TableRow key={tx.transaction_id}>
                            <TableCell className="text-sm text-slate-600">
                              {tx.created_at ? new Date(tx.created_at).toLocaleString() : "N/A"}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${tx.transaction_type === "EARN" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                              >
                                {tx.transaction_type === "EARN"
                                  ? "Tích Điểm"
                                  : "Đổi Ưu Đãi"}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm font-medium text-slate-700 text-right">
                              {Number(tx.order_amount).toLocaleString()}đ
                            </TableCell>
                            <TableCell
                              className={`text-sm font-bold text-right ${tx.transaction_type === "EARN" ? "text-emerald-500" : "text-rose-500"}`}
                            >
                              {tx.transaction_type === "EARN" ? "+" : "-"}
                              {tx.points}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-500 hover:text-indigo-600"
                                onClick={() =>
                                  setViewTransaction({
                                    ...tx,
                                    customer: viewCustomer,
                                  })
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                ) : (
                  <div className="max-h-[250px] overflow-y-auto rounded-xl border border-slate-200">
                    <Table>
                      <TableHeader className="bg-slate-50 sticky top-0">
                        <TableRow>
                          <TableHead className="text-xs font-semibold uppercase text-slate-700">Ngày</TableHead>
                          <TableHead className="text-xs font-semibold uppercase text-slate-700">Mã đơn</TableHead>
                          <TableHead className="text-xs font-semibold uppercase text-slate-700 text-right">Tổng tiền</TableHead>
                          <TableHead className="text-xs font-semibold uppercase text-slate-700 text-center">Trạng thái</TableHead>
                          <TableHead className="text-xs font-semibold uppercase text-slate-700 text-right">Chi tiết</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingOrders ? (
                           <TableRow><TableCell colSpan={5} className="text-center py-4 text-slate-500">Đang tải...</TableCell></TableRow>
                        ) : customerOrders.length === 0 ? (
                           <TableRow><TableCell colSpan={5} className="text-center py-4 text-slate-500">Chưa có hóa đơn nào.</TableCell></TableRow>
                        ) : (
                           customerOrders.map(order => (
                             <TableRow key={order.order_id}>
                               <TableCell className="text-sm text-slate-600">{order.created_at ? new Date(order.created_at).toLocaleString() : "N/A"}</TableCell>
                               <TableCell className="font-medium text-slate-900">{order.invoice_code}</TableCell>
                               <TableCell className="text-sm font-bold text-emerald-600 text-right">{Number(order.total_amount).toLocaleString()}đ</TableCell>
                               <TableCell className="text-center">
                                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{order.status.toUpperCase()}</span>
                               </TableCell>
                               <TableCell className="text-right">
                                 <Button variant="ghost" size="icon" onClick={() => setViewOrder(order)}><Eye className="h-4 w-4" /></Button>
                               </TableCell>
                             </TableRow>
                           ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900">
              Xác nhận xóa
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-500 text-sm">
            Bạn có chắc chắn muốn xóa khách hàng này không? Khách hàng sẽ được
            ẩn khỏi danh sách (Soft Delete) để bảo toàn lịch sử giao dịch.
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              className="text-slate-500 hover:text-slate-900 hover:bg-white"
            >
              Hủy
            </Button>
            <Button
              className="bg-rose-500 text-slate-900 hover:bg-rose-600"
              onClick={() => {
                if (deleteTarget)
                  deleteCustomer(deleteTarget, {
                    onSuccess: () => setDeleteTarget(null),
                  });
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa khách hàng"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!restoreTarget}
        onOpenChange={() => setRestoreTarget(null)}
      >
        <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900">
              Khôi phục khách hàng
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-500 text-sm">
            Bạn có muốn khôi phục khách hàng này để tiếp tục sử dụng?
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setRestoreTarget(null)}
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              Hủy
            </Button>
            <Button
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={() => {
                if (restoreTarget)
                  restoreCustomer(restoreTarget, {
                    onSuccess: () => setRestoreTarget(null),
                  });
              }}
              disabled={isRestoring}
            >
              {isRestoring ? "Đang khôi phục..." : "Khôi phục"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Modal */}
      <Dialog
        open={!!viewTransaction}
        onOpenChange={() => setViewTransaction(null)}
      >
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-[500px] rounded-3xl shadow-xl p-0 overflow-hidden z-[100]">
          {viewTransaction && (
            <>
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Chi tiết giao dịch
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Mã HĐ:{" "}
                    <span className="font-semibold text-slate-700">
                      {viewTransaction.pos_invoice_code}
                    </span>
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider ${
                    viewTransaction.transaction_type === "EARN"
                      ? "border-emerald-500/20 bg-emerald-100 text-emerald-700"
                      : "border-rose-500/20 bg-rose-100 text-rose-700"
                  }`}
                >
                  {viewTransaction.transaction_type}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Khách hàng
                    </p>
                    <p className="font-medium text-slate-900">
                      {viewTransaction.customer?.full_name || "Khách vãng lai"}
                    </p>
                    {viewTransaction.customer && (
                      <p className="text-sm text-slate-500">
                        {viewTransaction.customer.phone_number}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Ngày giờ
                    </p>
                    <p className="font-medium text-slate-900">
                      {new Date(
                        viewTransaction.created_at || "",
                      ).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(
                        viewTransaction.created_at || "",
                      ).toLocaleTimeString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-3 gap-4 border border-slate-100 mt-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Tổng Tiền
                    </p>
                    <p className="font-bold text-slate-900">
                      {Number(viewTransaction.order_amount).toLocaleString()}đ
                    </p>
                  </div>
                  <div className="text-center border-l border-r border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Điểm
                    </p>
                    <p
                      className={`font-bold ${viewTransaction.transaction_type === "EARN" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {viewTransaction.transaction_type === "EARN" ? "+" : "-"}
                      {viewTransaction.points}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Số dư điểm
                    </p>
                    <p className="font-bold text-indigo-600">
                      {viewTransaction.balance_after}
                    </p>
                  </div>
                </div>

                {viewTransaction.is_offline_sync && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Giao dịch đồng bộ Offline
                  </div>
                )}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setViewTransaction(null)}
                >
                  Đóng
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <Dialog
        open={!!viewOrder}
        onOpenChange={() => setViewOrder(null)}
      >
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-[600px] rounded-3xl shadow-xl p-0 overflow-hidden z-[110]">
          {viewOrder && (
            <>
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Chi tiết Hóa đơn
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Mã HĐ:{" "}
                    <span className="font-semibold text-slate-700">
                      {viewOrder.invoice_code}
                    </span>
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider ${
                    viewOrder.status === "completed"
                      ? "border-emerald-500/20 bg-emerald-100 text-emerald-700"
                      : "border-rose-500/20 bg-rose-100 text-rose-700"
                  }`}
                >
                  {viewOrder.status}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Khách hàng
                    </p>
                    <p className="font-medium text-slate-900">
                      {viewCustomer?.full_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {viewCustomer?.phone_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Ngày giờ
                    </p>
                    <p className="font-medium text-slate-900">
                      {viewOrder.created_at ? new Date(viewOrder.created_at).toLocaleDateString("vi-VN") : "N/A"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {viewOrder.created_at ? new Date(viewOrder.created_at).toLocaleTimeString("vi-VN") : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="text-xs font-semibold text-slate-700">Tên sản phẩm</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-700 text-center">SL</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-700 text-right">Đơn giá</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-700 text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewOrder.items && viewOrder.items.length > 0 ? (
                        viewOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-slate-900">{item.product_name}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right text-slate-600">{Number(item.price).toLocaleString()}đ</TableCell>
                            <TableCell className="text-right font-semibold text-emerald-600">{Number(item.subtotal).toLocaleString()}đ</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-slate-500 py-4">
                            Không có chi tiết mặt hàng
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end pt-4">
                  <div className="w-1/2 space-y-2">
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="font-bold text-slate-900 uppercase">Tổng cộng:</span>
                      <span className="font-bold text-xl text-emerald-600">{Number(viewOrder.total_amount).toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button variant="outline" className="rounded-xl" onClick={() => setViewOrder(null)}>Đóng</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useStores } from '@/hooks/useStores';
import { Store } from '@/types/store';

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
import { Plus, Trash2, Edit, Eye, X, ArchiveRestore, Search } from "lucide-react";
import { useForm } from "react-hook-form";



export default function StoresPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewStore, setViewStore] = useState<Store | null>(null);
  const [editStore, setEditStore] = useState<Store | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<"active" | "trash">("active");
  const [restoreTarget, setRestoreTarget] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { stores, isLoading, createStore, isCreating, updateStore, isUpdating, deleteStore, isDeleting, restoreStore, isRestoring } = useStores(activeTab);

  const filteredStores = stores.filter(store => 
    store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    store.storeCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (store.address && store.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: Record<string, unknown>) => {
    if (editStore) {
      updateStore({ id: editStore.id, data }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    } else {
      createStore(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  const handleOpenCreate = () => {
    setEditStore(null);
    reset({ storeCode: "", storeName: "", address: "", status: "ACTIVE" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (store: Store) => {
    setEditStore(store);
    reset({
      storeCode: store.storeCode,
      storeName: store.storeName,
      address: store.address,
      status: store.status,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Stores
          </h1>
          <p className="mt-1 text-slate-500">
            Manage your store locations and API keys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Tìm mã, tên cửa hàng..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
            />
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditStore(null);
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
                <span className="text-white">Add Store</span>
              </Button>
            }
          />
          <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
            <DialogHeader>
              <DialogTitle className="text-xl text-slate-900">
                {editStore ? "Edit store" : "Create new store"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">
                  Store Code
                </Label>
                <Input
                  className="border-slate-200 bg-white focus-visible:ring-indigo-500"
                  {...register("storeCode", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">
                  Store Name
                </Label>
                <Input
                  className="border-slate-200 bg-white focus-visible:ring-indigo-500"
                  {...register("storeName", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">
                  Address
                </Label>
                <Input
                  className="border-slate-200 bg-white focus-visible:ring-indigo-500"
                  {...register("address", { required: true })}
                />
              </div>
              {editStore && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">
                    Status
                  </Label>
                  <select
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:ring-indigo-500 outline-none"
                    {...register("status", { required: true })}
                  >
                    <option value="ACTIVE" className="bg-white">
                      ACTIVE
                    </option>
                    <option value="INACTIVE" className="bg-white">
                      INACTIVE
                    </option>
                  </select>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 mt-4 rounded-xl"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? "Saving..." : "Save Store"}
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
                Code
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Address
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                API Key
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
                  colSpan={6}
                  className="text-center text-slate-500 py-8"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredStores.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-slate-500 py-8"
                >
                  No stores found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStores.map((store) => (
                <TableRow
                  key={store.id}
                  className="border-slate-100 transition-colors hover:bg-white"
                >
                  <TableCell className="font-medium text-slate-900">
                    {store.storeCode}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {store.storeName}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {store.address}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${store.status === "ACTIVE" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-400"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${store.status === "ACTIVE" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-rose-500"}`}
                      />
                      {store.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    <div
                      className="rounded border border-slate-200 bg-slate-50 px-2 py-1 truncate max-w-[120px]"
                      title={store.apiKey}
                    >
                      {store.apiKey}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        onClick={() => setViewStore(store)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {activeTab === "active" ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                            onClick={() => handleOpenEdit(store)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            onClick={() => setDeleteTarget(store.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                          onClick={() => setRestoreTarget(store.id)}
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

      <Dialog open={!!viewStore} onOpenChange={() => setViewStore(null)}>
        <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[500px] rounded-2xl shadow-2xl shadow-slate-200/50">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900">
              Store Details
            </DialogTitle>
          </DialogHeader>
          {viewStore && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-3 border-b border-slate-200 pb-4">
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Store Code
                </span>
                <span className="col-span-2 font-medium text-slate-900">
                  {viewStore.storeCode}
                </span>
              </div>
              <div className="grid grid-cols-3 border-b border-slate-200 pb-4">
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Store Name
                </span>
                <span className="col-span-2 text-slate-700">
                  {viewStore.storeName}
                </span>
              </div>
              <div className="grid grid-cols-3 border-b border-slate-200 pb-4">
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Address
                </span>
                <span className="col-span-2 text-slate-500">
                  {viewStore.address}
                </span>
              </div>
              <div className="grid grid-cols-3 border-b border-slate-200 pb-4">
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Status
                </span>
                <span className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${viewStore.status === "ACTIVE" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-400"}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${viewStore.status === "ACTIVE" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-rose-500"}`}
                    />
                    {viewStore.status}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 pb-2">
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  API Key
                </span>
                <div className="col-span-2 font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-md p-2 break-all">
                  {viewStore.apiKey}
                </div>
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
            Bạn có chắc chắn muốn xóa cửa hàng này không? Cửa hàng sẽ được ẩn
            khỏi danh sách (Soft Delete) để bảo toàn dữ liệu.
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
                if (deleteTarget) deleteStore(deleteTarget, { onSuccess: () => setDeleteTarget(null) });
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa cửa hàng"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!restoreTarget} onOpenChange={() => setRestoreTarget(null)}>
        <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900">
              Khôi phục cửa hàng
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-500 text-sm">
            Bạn có muốn khôi phục cửa hàng này để tiếp tục sử dụng?
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
                if (restoreTarget) restoreStore(restoreTarget, { onSuccess: () => setRestoreTarget(null) });
              }}
              disabled={isRestoring}
            >
              {isRestoring ? "Đang khôi phục..." : "Khôi phục"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

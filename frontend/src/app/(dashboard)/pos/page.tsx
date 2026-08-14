"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Search,
  User,
  Phone,
  Mail,
  Award,
  Coins,
  CalendarDays,
  Gift,
  ShoppingBag,
  Receipt,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { customerService } from "@/services/customer.service";
import { voucherService } from "@/services/voucher.service";
import { Customer } from "@/types/customer";
import { useTransactions } from "@/hooks/useTransactions";
import { useVouchers, useRewards } from "@/hooks/useVouchers";
import { createOrder } from "@/services/order.service";

export default function POSPage() {
  const [phone, setPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");

  const [activeTab, setActiveTab] = useState<"earn" | "redeem">("earn");
  
  const [cartItems, setCartItems] = useState<{product_name: string, price: number, quantity: number}[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);

  const orderAmountNum = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const { createTransaction, isCreating } = useTransactions();
  const { rewards, isLoading: isLoadingRewards } = useRewards();
  const { exchangeVoucher, isExchanging } = useVouchers();

  const searchMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      if (!phoneNumber) throw new Error("Vui lòng nhập số điện thoại");
      // Mặc định customerService.getCustomerByPhone trả về Customer hoặc bắn lỗi
      return customerService.getCustomerByPhone(phoneNumber);
    },
    onSuccess: () => {
      setSearchedPhone(phone);
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
          (error instanceof Error
            ? error.message
            : "Không tìm thấy khách hàng"),
      );
    },
    });

  const checkVoucherMutation = useMutation({
    mutationFn: async () => {
      if (!customer) throw new Error("Chưa có thông tin khách hàng");
      if (orderAmountNum <= 0) throw new Error("Giỏ hàng trống");
      if (!voucherCode) throw new Error("Vui lòng nhập mã voucher");
      return voucherService.checkVoucher({ 
        voucher_code: voucherCode, 
        customer_id: customer.customer_id.toString(), 
        order_amount: orderAmountNum 
      });
    },
    onSuccess: (data) => {
      toast.success("Áp dụng voucher thành công!");
      let discount = Number(data.discount_value);
      if (data.voucher_type === 'PERCENTAGE') {
        discount = (orderAmountNum * discount) / 100;
        if (data.max_discount && discount > Number(data.max_discount)) {
          discount = Number(data.max_discount);
        }
      }
      setAppliedDiscount(discount);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Voucher không hợp lệ");
      setAppliedDiscount(null);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    searchMutation.mutate(phone.trim());
  };

  const orderMutation = useMutation({
    mutationFn: async (payload: any) => {
      return createOrder(payload);
    },
  });

  const customer: Customer | null = searchMutation.data || null;

  const handleAddToCart = () => {
    if (!newItemName.trim()) {
      toast.error("Vui lòng nhập tên món"); return;
    }
    const price = Number(newItemPrice.replace(/[^0-9]/g, ""));
    const qty = Number(newItemQty);
    if (!price || price <= 0) { toast.error("Đơn giá không hợp lệ"); return; }
    if (!qty || qty <= 0) { toast.error("Số lượng không hợp lệ"); return; }

    setCartItems([...cartItems, { product_name: newItemName.trim(), price, quantity: qty }]);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemQty("1");
    if (appliedDiscount) setAppliedDiscount(null);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
    if (appliedDiscount) setAppliedDiscount(null);
  };

  const handleEarnPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    if (orderAmountNum <= 0 || cartItems.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return;
    }
    
    try {
      // 1. Create Order
      const newOrder = await orderMutation.mutateAsync({
        customer_id: customer.customer_id,
        items: cartItems,
      });

      // 2. Create Point Transaction using invoice_code
      createTransaction(
        {
          customer_id: customer.customer_id,
          order_amount: orderAmountNum,
          voucher_code: appliedDiscount !== null ? voucherCode : undefined,
          pos_invoice_code: newOrder.invoice_code
        },
        {
          onSuccess: () => {
            setCartItems([]);
            setVoucherCode("");
            setAppliedDiscount(null);
            searchMutation.mutate(searchedPhone);
          },
        },
      );
    } catch (error) {
      toast.error("Lỗi khi thanh toán: " + (error instanceof Error ? error.message : "Unkown error"));
    }
  };

  const handleRedeem = (rewardId: string) => {
    if (!customer) return;
    exchangeVoucher(
      { customer_id: customer.customer_id, reward_id: rewardId },
      {
        onSuccess: () => {
          searchMutation.mutate(searchedPhone);
        },
      },
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-2 mt-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Tra cứu POS
        </h1>
        <p className="text-slate-500 text-lg">
          Nhập số điện thoại để tra cứu thông tin thẻ thành viên và điểm tích
          lũy
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 backdrop-blur-xl">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại khách hàng (VD: 0987654321)"
              className="pl-12 h-14 text-lg bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-2xl transition-all shadow-sm"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={searchMutation.isPending}
            className="h-14 px-8 text-lg font-medium rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
          >
            {searchMutation.isPending ? "Đang tra cứu..." : "Tra cứu"}
          </Button>
        </form>
      </div>

      {searchMutation.isPending && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {customer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-500">
          {/* Cột 1: Thông tin hạng & Điểm (Membership Card Look) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-white shadow-2xl shadow-indigo-900/30">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"></div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-widest font-medium mb-1">
                    Hạng thành viên
                  </p>
                  <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500 flex items-center gap-2">
                    <Award className="h-8 w-8 text-amber-400" />
                    {customer.tier?.tier_name || "Khách Hàng Mới"}
                  </h2>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-inner">
                  <Coins className="h-8 w-8 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">
                  Điểm hiện có
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-emerald-400 tracking-tighter">
                    {customer.total_points.toLocaleString()}
                  </span>
                  <span className="text-emerald-500/80 font-medium text-xl">
                    PTS
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="text-slate-300">
                  Tổng chi:{" "}
                  <span className="font-bold text-white">
                    {Number(customer.total_spent).toLocaleString()}đ
                  </span>
                </div>
                {/* <Button 
                  onClick={() => addSpentMutation.mutate({ id: customer.customer_id, amount: 15000000 })}
                  disabled={addSpentMutation.isPending}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/10"
                  size="sm"
                >
                  {addSpentMutation.isPending ? 'Đang xử lý...' : '+ Demo: Mua 15M đ'}
                </Button> */}
              </div>
            </div>
          </div>

          {/* Cột 2: Thông tin cá nhân */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-100">
              <User className="text-indigo-500" />
              Thông tin cá nhân
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Họ và tên
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {customer.full_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Số điện thoại
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {customer.phone_number}
                  </p>
                </div>
              </div>

              {customer.email && (
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Email</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {customer.email}
                    </p>
                  </div>
                </div>
              )}

              {customer.date_of_birth && (
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Ngày sinh
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(customer.date_of_birth).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">
                Trạng thái:
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold border ${customer.status === "active" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" : "border-rose-500/20 bg-rose-500/10 text-rose-600"}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${customer.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`}
                />
                {customer.status === "active" ? "Hoạt động" : "Đã khóa"}
              </span>
            </div>
          </div>

          {/* Cột 3 (Full width): Action Panel (Tích điểm / Đổi quà) */}
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mt-2">
            <div className="flex border-b border-slate-100">
              <button
                className={`flex-1 py-5 text-center font-bold text-lg transition-colors flex items-center justify-center gap-2 ${activeTab === "earn" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                onClick={() => setActiveTab("earn")}
              >
                <ShoppingBag className="h-5 w-5" />
                Ghi nhận chi tiêu (Tích Điểm)
              </button>
              <button
                className={`flex-1 py-5 text-center font-bold text-lg transition-colors flex items-center justify-center gap-2 ${activeTab === "redeem" ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                onClick={() => setActiveTab("redeem")}
              >
                <Gift className="h-5 w-5" />
                Đổi ưu đãi (Redeem)
              </button>
            </div>

            <div className="p-8">
              {activeTab === "earn" ? (
                <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Add Item Form */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Thêm món hàng
                      </h4>
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 sm:col-span-5">
                          <Input
                            type="text"
                            placeholder="Tên sản phẩm..."
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="bg-white"
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-4">
                          <Input
                            type="text"
                            placeholder="Đơn giá..."
                            value={newItemPrice}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, "");
                              setNewItemPrice(val ? Number(val).toLocaleString("en-US") : "");
                            }}
                            className="bg-white"
                          />
                        </div>
                        <div className="col-span-8 sm:col-span-2">
                          <Input
                            type="number"
                            min="1"
                            placeholder="SL"
                            value={newItemQty}
                            onChange={(e) => setNewItemQty(e.target.value)}
                            className="bg-white text-center"
                          />
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <Button 
                            type="button" 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 p-0"
                            onClick={handleAddToCart}
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Cart Items Table */}
                    {cartItems.length > 0 && (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                              <th className="px-4 py-3">Sản phẩm</th>
                              <th className="px-4 py-3 text-center">SL</th>
                              <th className="px-4 py-3 text-right">Đơn giá</th>
                              <th className="px-4 py-3 text-right">Thành tiền</th>
                              <th className="px-4 py-3 text-center"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {cartItems.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium text-slate-700">{item.product_name}</td>
                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                <td className="px-4 py-3 text-right text-slate-500">{item.price.toLocaleString()}đ</td>
                                <td className="px-4 py-3 text-right font-semibold text-emerald-600">{(item.price * item.quantity).toLocaleString()}đ</td>
                                <td className="px-4 py-3 text-center">
                                  <button onClick={() => handleRemoveItem(idx)} className="text-rose-400 hover:text-rose-600">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-end bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                      <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Tổng cộng:</span>
                      <span className="text-3xl font-black text-emerald-600">{orderAmountNum.toLocaleString()}đ</span>
                    </div>

                    <form onSubmit={handleEarnPoints} className="space-y-6 pt-4 border-t border-slate-100">

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Mã Voucher giảm giá (nếu có)
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={voucherCode}
                          onChange={(e) => {
                            setVoucherCode(e.target.value);
                            if (appliedDiscount) setAppliedDiscount(null);
                          }}
                          className="flex-1 h-14 text-lg bg-slate-50 border border-slate-200 focus-visible:ring-indigo-500 rounded-xl px-4 font-medium text-slate-700"
                        >
                          <option value="">-- Chọn Voucher --</option>
                          {customer.vouchers && customer.vouchers.map(v => (
                            <option key={v.voucher_id} value={v.voucher_code}>
                              {v.voucher_code} (-{Number(v.discount_value).toLocaleString()}{v.voucher_type === 'PERCENTAGE' ? '%' : 'đ'})
                            </option>
                          ))}
                        </select>
                        <Button 
                          type="button" 
                          onClick={() => checkVoucherMutation.mutate()}
                          disabled={!voucherCode || orderAmountNum <= 0 || checkVoucherMutation.isPending}
                          className="h-14 px-6 bg-slate-800 hover:bg-slate-900 text-white"
                        >
                          {checkVoucherMutation.isPending ? "Đang xử lý" : "Áp dụng"}
                        </Button>
                      </div>
                    </div>

                    {appliedDiscount !== null && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between items-center text-emerald-800">
                        <div>
                          <span className="font-semibold block">Đã áp dụng giảm giá</span>
                          <span className="text-sm opacity-80">Áp dụng voucher {voucherCode}</span>
                        </div>
                        <div className="font-bold text-xl">
                          - {appliedDiscount.toLocaleString()}đ
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isCreating || orderMutation.isPending || cartItems.length === 0}
                      className="w-full h-14 text-lg font-medium rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                    >
                      {isCreating || orderMutation.isPending ? "Đang xử lý..." : "Thanh toán & Tích điểm"}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  {isLoadingRewards ? (
                    <div className="text-center py-8 text-slate-500">
                      Đang tải danh sách ưu đãi...
                    </div>
                  ) : rewards.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      Chưa có ưu đãi nào khả dụng.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {rewards.map((reward: any) => (
                        <div
                          key={reward.reward_id}
                          className={`border rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden transition-all ${customer.total_points >= reward.required_points ? "border-emerald-200 bg-emerald-50/30 hover:border-emerald-300 hover:shadow-lg" : "border-slate-200 bg-slate-50 opacity-70 grayscale-[30%]"}`}
                        >
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2">
                              {reward.reward_name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-100/50 w-fit px-2.5 py-1 rounded-full text-sm">
                              <Coins className="h-4 w-4" />
                              {reward.required_points} điểm
                            </div>
                            {reward.voucher_discount_value && (
                              <div className="mt-3 text-sm text-slate-600 font-medium">
                                Giá trị:{" "}
                                <span className="text-rose-500">
                                  {Number(
                                    reward.voucher_discount_value,
                                  ).toLocaleString()}
                                  đ
                                </span>
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleRedeem(reward.reward_id)}
                            disabled={
                              isExchanging ||
                              customer.total_points < reward.required_points
                            }
                            className={`w-full font-semibold ${customer.total_points >= reward.required_points ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}
                          >
                            {isExchanging
                              ? "Đang đổi..."
                              : customer.total_points >= reward.required_points
                                ? "Đổi Ưu Đãi"
                                : "Không đủ điểm"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {searchMutation.isError && !searchMutation.isPending && searchedPhone && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Không tìm thấy khách hàng
          </h3>
          <p className="text-slate-500 mb-6">
            Số điện thoại <strong>{searchedPhone}</strong> chưa được đăng ký
            trong hệ thống CRM.
          </p>
          <Button
            variant="outline"
            className="border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl"
            onClick={() => setPhone("")}
          >
            Tìm số khác
          </Button>
        </div>
      )}
    </div>
  );
}

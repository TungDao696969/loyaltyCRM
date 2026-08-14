import { Customer } from "@/types/customer";

interface Props {
  customer: Customer;
}

export default function CustomerCard({ customer }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow mt-5">
      <h2 className="text-xl font-bold">{customer.full_name}</h2>

      <p>SĐT: {customer.phone_number}</p>

      <p>Email: {customer.email ?? "Chưa có"}</p>

      <p>Điểm hiện có: {customer.total_points}</p>

      <p>Hạng thành viên: {customer.tier?.tier_name ?? "Bronze"}</p>
    </div>
  );
}

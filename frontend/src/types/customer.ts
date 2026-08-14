export type Customer = {
  customer_id: string; // BigInt serialized as string
  phone_number: string;
  full_name: string;
  email: string | null;
  gender: string | null;
  date_of_birth: string | null;
  total_points: number;
  total_spent: string; // Decimal serialized as string
  status: string;
  tier?: {
    tier_name: string;
    tier_code: string;
  } | null;
  vouchers?: {
    voucher_id: string;
    voucher_code: string;
    voucher_type: string;
    discount_value: string;
    max_discount: string | null;
    min_order_value: string | null;
  }[];
};

export interface CustomerFilter {
  is_deleted?: boolean;
  email?: string;
  customer_id?: string;
  full_name?: string;
  status?: string;
  segment_id?: string;
}

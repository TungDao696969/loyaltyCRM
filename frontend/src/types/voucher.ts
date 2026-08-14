export interface Voucher {
  voucher_id: string; // BigInt serialized to string
  voucher_code: string;
  customer_id?: string | null;
  discount_value: string; // Decimal serialized to string
  status: string;
  expired_at?: string | null;
  used_at?: string | null;
  customer?: {
    full_name: string;
    phone_number: string;
  } | null;
}

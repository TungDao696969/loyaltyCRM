export interface Transaction {
  transaction_id: string; // BigInt
  customer_id?: string | null;
  store_id?: number | null;
  pos_invoice_code: string;
  transaction_type: 'EARN' | 'REDEEM' | string;
  order_amount: string; // Decimal
  points: number;
  balance_after: number;
  is_offline_sync?: boolean;
  created_at?: string;
  customer?: {
    full_name: string;
    phone_number: string;
  } | null;
  store?: {
    storeName: string;
  } | null;
}

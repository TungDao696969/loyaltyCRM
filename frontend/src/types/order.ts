import { Customer } from './customer';

export interface OrderItem {
  item_id: string; // BigInt serialized as string
  order_id: string; // BigInt serialized as string
  product_name: string;
  quantity: number;
  price: string; // Decimal serialized as string
  subtotal: string; // Decimal serialized as string
}

export interface Order {
  order_id: string; // BigInt serialized as string
  customer_id: string; // BigInt serialized as string
  invoice_code: string;
  total_amount: string; // Decimal serialized as string
  status: string;
  created_at: string; // ISO date string
  items?: OrderItem[];
  customer?: Customer;
}

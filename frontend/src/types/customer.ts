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

export type CustomerCampaignHistory = {
  id: number;
  campaign_id: number;
  customer_id: string;
  phone: string;
  zalo_user_id: string | null;
  status: string;
  provider_message_id: string | null;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
  campaign?: {
    campaign_id: number;
    campaign_name: string;
    channel: string;
  };
};

export type CustomerVoucherHistory = {
  voucher_id: string; // BigInt mapped to string
  voucher_code: string;
  customer_id: string | null;
  campaign_id: number | null;
  voucher_type: string | null;
  discount_value: string; // Decimal mapped to string
  max_discount: string | null;
  min_order_value: string | null;
  status: string | null;
  expired_at: string | null;
  used_at: string | null;
  campaign?: {
    campaign_id: number;
    campaign_name: string;
  } | null;
};

export interface CustomerFilter {
  is_deleted?: boolean;
  email?: string;
  customer_id?: string;
  full_name?: string;
  status?: string;
  segment_id?: string;
}

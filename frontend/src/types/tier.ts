export interface Tier {
  tier_id: number;
  tier_code: string;
  tier_name: string;
  min_spent_amount: string; // Decimal from prisma comes as string/number depending on backend
  point_multiplier: string;
  description?: string | null;
  created_at?: string | null;
}

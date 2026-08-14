export interface CustomerSegment {
  segment_id: number;
  segment_name: string;
  rfm_criteria: Record<string, any> | null;
  created_at?: string;
}

export interface Campaign {
  campaign_id: number;
  campaign_name: string;
  segment_id: number | null;
  channel: string;
  message_template: string | null;
  status: string;
  scheduled_at?: string;
  segment?: CustomerSegment;
}

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fucljiyczkpajddyykmd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_W6zFBz2oZRbh0YN-7v-4Iw_YyF1UpDW";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Comment = {
  id: string;
  property_id: string;
  user_id: string;
  username: string;
  text: string;
  parent_id: string | null;
  created_at: string;
};

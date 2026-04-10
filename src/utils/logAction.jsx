import { supabase } from "../lib/supabase";

export async function logAction(userId, action, table, recordId = null) {
  await supabase.from("audit_logs").insert([
    {
      user_id: userId,
      action,
      table_name: table,
      record_id: recordId
    }
  ]);
}
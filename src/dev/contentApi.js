
import { supabase } from "../supabase";

export async function checkEditorAccess() {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getUser();

  if (sessionError || !sessionData.user) {
    return false;
  }

  const { data, error } = await supabase
    .from("gcp_editors")
    .select("user_id")
    .eq("user_id", sessionData.user.id)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}

export async function getDraft(key) {
  const { data, error } = await supabase
    .from("gcp_content")
    .select("draft")
    .eq("content_key", key)
    .maybeSingle();

  if (error) throw error;

  return data?.draft ?? [];
}

export async function getPublished(key) {
  const { data, error } = await supabase.rpc(
    "gcp_get_published",
    { p_key: key }
  );

  if (error) throw error;

  return data ?? [];
}

export async function saveDraft(key, content) {
  const { error } = await supabase.rpc(
    "gcp_save_draft",
    {
      p_key: key,
      p_draft: content,
    }
  );

  if (error) throw error;
}

export async function publishContent(key) {
  const { error } = await supabase.rpc(
    "gcp_publish",
    { p_key: key }
  );

  if (error) throw error;
}

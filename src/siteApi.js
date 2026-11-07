
import { supabase } from "./supabase";
import { defaultSiteContent, cloneContent } from "./content";

export async function getPublishedContent() {
  if (!supabase) {
    return cloneContent(defaultSiteContent);
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "published")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.content ?? cloneContent(defaultSiteContent);
}

export async function getDraftContent() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "draft")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.content ?? null;
}

export async function saveContent(id, content) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  if (!["draft", "published"].includes(id)) {
    throw new Error("Invalid content destination.");
  }

  const { error } = await supabase
    .from("site_content")
    .upsert({
      id,
      content,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(error.message);
  }
}

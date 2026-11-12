
import { supabase } from "../supabase";

const BUCKET = "gcp-media";

export async function uploadPhotos(files) {
  const results = [];

  for (const file of files) {
    const extension = file.name.split(".").pop()?.toLowerCase();

    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

    if (!allowedExtensions.includes(extension) ||
        !allowedTypes.includes(file.type)) {
      throw new Error(`Unsupported image type: ${file.name}`);
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error(`${file.name} exceeds the 10 MB limit.`);
    }

    const path = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    results.push({
      id: crypto.randomUUID(),
      path,
      url: data.publicUrl,
      alt: "",
    });
  }

  return results;
}

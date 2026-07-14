/**
 * Branch media helper
 * -------------------
 * The Branch model only has a single `mapUrl` column, but the UI wants to
 * display an optional Google-Maps link, an image, and a video per branch.
 * We pack/unpack them into that one column using JSON when media exists,
 * and keep plain-string map URLs backward compatible.
 */
export type BranchMedia = {
  map?: string;
  image?: string;
  video?: string;
};

export function parseBranchMedia(raw?: string | null): BranchMedia {
  if (!raw || !raw.trim()) return {};
  const value = raw.trim();
  // JSON packed form: {"map":...,"image":...,"video":...}
  if (value.startsWith("{") && value.endsWith("}")) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return {
          map: typeof parsed.map === "string" ? parsed.map : undefined,
          image: typeof parsed.image === "string" ? parsed.image : undefined,
          video: typeof parsed.video === "string" ? parsed.video : undefined,
        };
      }
    } catch {
      // fall through to plain-URL handling
    }
  }
  // Plain URL (legacy) → treat as map link
  return { map: value };
}

export function packBranchMedia(
  mapUrl?: string,
  imageUrl?: string,
  videoUrl?: string,
): string {
  const map = (mapUrl ?? "").trim();
  const image = (imageUrl ?? "").trim();
  const video = (videoUrl ?? "").trim();

  // If only a map URL is provided, store it as a plain string (backward compat)
  if (!image && !video) {
    return map;
  }
  // Otherwise pack as JSON
  const payload: BranchMedia = {};
  if (map) payload.map = map;
  if (image) payload.image = image;
  if (video) payload.video = video;
  return JSON.stringify(payload);
}

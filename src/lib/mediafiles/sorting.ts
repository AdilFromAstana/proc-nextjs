import { MediaFile } from "@/types/media";

export function sortMediafiles(mediafiles: MediaFile[], sortOrder: string) {
  return [...mediafiles].sort((a, b) => {
    if (sortOrder === "name_asc") return a.name.localeCompare(b.name);
    if (sortOrder === "name_desc") return b.name.localeCompare(a.name);
    if (sortOrder === "date_newest")
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return 0;
  });
}

import { MediaFile } from "@/types/media";

export function filterMediafiles(
  mediafiles: MediaFile[],
  {
    searchQuery,
    statusFilter,
    typeFilter,
  }: { searchQuery: string; statusFilter: string; typeFilter: string }
) {
  return mediafiles.filter((course) => {
    if (
      searchQuery &&
      !course.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter !== "all" && course.status !== statusFilter) {
      return false;
    }
    if (typeFilter !== "all" && course.type !== typeFilter) {
      return false;
    }
    return true;
  });
}

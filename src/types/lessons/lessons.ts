export interface FetchLessonsListParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface LessonItem {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  color: string;
}

export interface LessonsListResponse {
  status: string;
  status_code: string;
  entities: {
    data: LessonItem[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

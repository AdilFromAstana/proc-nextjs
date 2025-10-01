export interface FetchClassesListParams {
  type?: string;
  orderBy?: string;
  page?: number;
}
export interface ClassesListResponse {
  status: string;
  status_code: string;
  entities: {
    current_page: number;
    data: ClassEntity[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: [];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
  };
}

export interface ClassEntity {
  id: number;
  type?: string;
  name: string;
  description: string;
  image?: string;
  color?: string;
  students_count?: number;
  teachers_count?: number;
}

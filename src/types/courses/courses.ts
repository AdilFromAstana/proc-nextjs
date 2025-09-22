export interface CoursesListResponse {
  status: string;
  status_code: string;
  entities: {
    current_page: number;
    data: CourseItemInList[];
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

export interface CourseItemInList {
  id: number;
  status: string;
  name: string;
  short_description: string | null;
  image: string | null;
  color: string;
}

export interface CourseItemResponse {
  status: string;
  status_code: string;
  entity: CourseItem[];
}

export interface CourseItem {
  id: number;
  status: string;
  availability_type: string;
  image: string;
  name: string;
  description: string;
  short_description: string;
  starting_at_type: string;
  starting_at: string;
  ending_at_type: string;
  ending_at: string;
  groups: CourseMaterialItem[];
  products: [];
  records: [];
}

export interface CourseMaterialItem {
  id: number;
  name: string;
  description: string;
  materials: MaterialItemData[];
}

export interface MaterialItemData {
  id: number;
  type: string;
  image: string;
  color: string;
  name: string;
  description: string;
  short_description: string;
}

export interface CourseNewsItem {
  id: number;
  title: string;
  announce: string;
  image: string;
  created_at: string;
}

export interface FetchCoursesListParams {
  status?: number;
  availability_type?: number;
  type?: any;
  query?: string;
}

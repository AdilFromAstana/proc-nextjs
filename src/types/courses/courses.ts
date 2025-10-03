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
  entity: CourseItem;
}

export interface CourseItem {
  id: number;
  owner_id: number;
  invite_code_id: number | null;
  certificate_id: number | null;
  status: "published" | "draft";
  availability_type: "free" | "private" | "prepaid";
  image: string;
  name: string;
  description: string;
  short_description: string;
  starting_at_type: string;
  starting_at: string;
  ending_at_type: string;
  ending_at: string;
  materials_count?: number;
  students_count?: number;
  teachers_count?: number;
  records_count?: number;
  products_count?: number;
  groups?: any[];
  records?: any[];
  products?: any[];
}
export interface CourseItemEdit {
  id: number;
  owner_id: number;
  invite_code_id: number | null;
  certificate_id: number | null;
  status: "published" | "draft";
  availability_type: "free" | "private" | "prepaid";
  image: string;
  name: string;
  description: string;
  short_description: string;
  starting_at_type: string;
  starting_at: string;
  ending_at_type: string;
  ending_at: string;
  certificate: null;
  invite_code: null;
  groups: any[];
  records: any[];
  teachers: any[];
  students: any[];
  products: any[];
  settings: any[];
  removed_teachers: any[];
  removed_students: any[];
  removed_records: any[];
  removed_products: any[];
  removed_groups: any[];
  removed_materials: any[];
  materials_count: number;
  students_count: number;
  teachers_count: number;
  records_count: number;
  products_count: number;
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
  page: number;
  status?: number;
  availability_type?: number;
  type?: any;
  query?: string;
}

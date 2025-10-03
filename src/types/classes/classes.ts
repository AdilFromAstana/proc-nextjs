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

export interface ClassEntityResponse {
  status: string;
  status_code: string;
  entity: ClassEntity;
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

export interface FetchStudentsNTeachersParams {
  page: number;
  limit: number;
  class_id: number;
}

export interface StudentsNTeachersResponse {
  status: string;
  status_code: string;
  entities: {
    current_page: 1;
    data: StudentNTeacherEntity[];
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

export interface StudentNTeacherEntity {
  id: number;
  user_id: number;
  user: {
    id: number;
    photo: string;
    color: string;
    photo_thumb: {
      big: string;
      medium: string;
      small: string;
    };
    firstname: string;
    lastname: string;
    last_activity_date?: string;
    is_online: false;
  };
}

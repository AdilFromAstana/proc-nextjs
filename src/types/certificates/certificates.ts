export interface CertificatesListResponse {
  status: string;
  status_code: string;
  entities: {
    current_page: number;
    data: CertificateItem[];
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

export interface CertificateItemResponse {
  status: string;
  status_code: string;
  entity: CertificateItem;
}

export interface CertificateItem {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  meta: [
    {
      field: string;
      value: string;
    },
    {
      field: string;
      value: string;
    }
  ];
  serial_number: number | null;
  serial_counter: number | null;
  image: string;
}

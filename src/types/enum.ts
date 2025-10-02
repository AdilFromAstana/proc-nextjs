export interface EnumOption {
  raw: string;
  name: string;
}

export interface EnumsResponse {
  status: string;
  status_code: string;
  enumerations: {
    [key: string]: EnumOption[];
  };
}

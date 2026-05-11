export interface User {
  id: number;
  name: string;
  age: number;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  age: number;
  city: string;
  state: string;
  pincode: string;
}

export interface ApiError {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

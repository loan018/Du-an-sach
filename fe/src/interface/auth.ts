export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  gender?: "Nam" | "Nữ" | "Khác";
  birthday?: string; 
  role: "user" | "admin" | "staff";
  isActive: boolean;
  favorites?: string[];
}


export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string; 
}

export interface IUserResponse {
   message: string;
  token: string;
  user: Pick<IUser, "_id" | "name" | "role">;
}
export interface IUserListResponse {
  success: boolean;
  users: IUser[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}export interface IUpdateProfileInput {
  name: string;
  phone?: string;
  gender?: "Nam" | "Nữ" | "Khác";
  birthday?: string;
  avatar?: string; 
}




export interface ICategory {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  image?: string;  
}

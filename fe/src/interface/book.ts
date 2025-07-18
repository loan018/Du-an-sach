export interface IBook {
  _id?: string ;
  title: string;
  image: string;
  oldPrice?: number; 
  price: number;
  category: string | { _id: string; name: string; slug: string }; 
  author: string;
  description?: string;
  quantity: number;
  sold?: number;             
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

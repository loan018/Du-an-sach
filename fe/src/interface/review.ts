export interface IReview {
  _id?: string;
  user: string | { _id: string; name: string };  
  book: string | { _id: string; title: string }; 
  rating: number;                              
  comment?: string;                            
  isActive?: boolean;                           
  createdAt?: string;
  updatedAt?: string;
}
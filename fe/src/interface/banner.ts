export interface IBanner {
  _id?: string;
  title: string;
  image: string;
  link?: string;
  startDate: Date |string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

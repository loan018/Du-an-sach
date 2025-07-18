import { IBook } from "./book";

export interface IShippingInfo {
  name: string;
  address: string;
  phone: string;
}

export interface IOrderItem {
  book: IBook; 
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "confirming" | "shipping" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "vnpay";

export interface IOrder {
  _id: string;
  user: string;
  orderCode:string;
  shippingInfo: IShippingInfo;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  paidAt?: string; 
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
export interface IAddress {
  _id?: string;
  user: string;
  fullName: string;
  phone: string;
  province: string;
  ward: string;
  street: string;
  address?: string; 
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  type?: "home" | "office";
}


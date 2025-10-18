export enum Category {
  ALL = "All",
  IPHONE = "iPhone",
  ANDROID = "Android",
  LAPTOP = "Laptop",
}

export enum StockStatus {
  READY = "Ready",
  SOLD = "Sold",
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  images: string[];
  stockStatus: StockStatus;
}

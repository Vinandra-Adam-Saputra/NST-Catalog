import type { Product } from '../types';
import { Category, StockStatus } from '../types';

let products: Product[] = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    category: Category.IPHONE,
    price: 999,
    description: "The ultimate iPhone.\n- A16 Bionic chip\n- Pro camera system\n- All-day battery life",
    images: ['https://picsum.photos/seed/iphone14pro/800/600', 'https://picsum.photos/seed/iphone14pro2/800/600', 'https://picsum.photos/seed/iphone14pro3/800/600'],
    stockStatus: StockStatus.READY,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23 Ultra',
    category: Category.ANDROID,
    price: 1199,
    description: "The new standard of premium smartphones.\n- Integrated S Pen\n- Pro-grade Camera\n- Powerful gaming performance",
    images: ['https://picsum.photos/seed/s23ultra/800/600', 'https://picsum.photos/seed/s23ultra2/800/600'],
    stockStatus: StockStatus.READY,
  },
  {
    id: '3',
    name: 'MacBook Pro 14"',
    category: Category.LAPTOP,
    price: 1999,
    description: "Mind-blowing performance.\n- M2 Pro Chip\n- Stunning Liquid Retina XDR display\n- Up to 18 hours of battery life",
    images: ['https://picsum.photos/seed/macbook14/800/600', 'https://picsum.photos/seed/macbook14-2/800/600'],
    stockStatus: StockStatus.READY,
  },
  {
    id: '4',
    name: 'Google Pixel 7 Pro',
    category: Category.ANDROID,
    price: 899,
    description: "The all-pro phone, powered by Google.\n- Google Tensor G2\n- Pro-level camera system\n- Adaptive Battery can last over 24 hours",
    images: ['https://picsum.photos/seed/pixel7pro/800/600'],
    stockStatus: StockStatus.SOLD,
  },
  {
    id: '5',
    name: 'iPhone 13',
    category: Category.IPHONE,
    price: 699,
    description: "As amazing as ever.\n- A15 Bionic chip\n- Advanced dual-camera system\n- Super Retina XDR display",
    images: ['https://picsum.photos/seed/iphone13/800/600'],
    stockStatus: StockStatus.READY,
  },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockApi = {
  getProducts: async (includeSold = false): Promise<Product[]> => {
    await delay(500);
    if (includeSold) {
        return [...products];
    }
    return [...products].filter(p => p.stockStatus === StockStatus.READY);
  },

  getProductById: async (id: string): Promise<Product | null> => {
    await delay(300);
    const product = products.find(p => p.id === id);
    return product ? { ...product } : null;
  },

  addProduct: async (productData: Omit<Product, 'id'> & {id?: string}): Promise<Product> => {
    await delay(700);
    const newProduct: Product = {
      id: productData.id || String(Date.now() + Math.random()),
      ...productData,
    };
    products.unshift(newProduct);
    return { ...newProduct };
  },

  updateProduct: async (id: string, updatedData: Partial<Product>): Promise<Product | null> => {
    await delay(700);
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData };
      return { ...products[index] };
    }
    return null;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await delay(500);
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    return products.length < initialLength;
  },
  
  login: async (email: string, password: string): Promise<{ token: string }> => {
    await delay(1000);
    if (email === 'admin@nstore.com' && password === 'password') {
      const token = 'fake-auth-token';
      localStorage.setItem('authToken', token);
      return { token };
    }
    throw new Error('Invalid credentials');
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
  },
  
  checkAuth: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

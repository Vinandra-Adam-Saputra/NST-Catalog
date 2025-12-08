# NSTORE E-CATALOG

A clean, minimalist, and fully responsive e-catalog website for a mobile phone store. It provides customers with an elegant way to view products and a secure dashboard for the admin to manage inventory.

## 🚀 Features

- **Responsive Design**: Works seamlessly on all devices (desktop, tablet, mobile)
- **Product Catalog**: Browse products with detailed views and images
- **Admin Dashboard**: Secure admin panel for managing products
- **Authentication**: Protected admin routes with login functionality
- **Category Filtering**: Organize products by categories (iPhone, Android, Laptop)
- **Stock Management**: Track product availability (Ready/Sold)
- **Modern UI**: Clean and intuitive user interface

## 🛠️ Tech Stack

- **React 19**: Modern JavaScript library for building user interfaces
- **TypeScript**: Strongly-typed programming language that builds on JavaScript
- **Vite**: Next-generation frontend tooling for faster development
- **Supabase**: Backend-as-a-service for authentication and database
- **React Router DOM**: Declarative routing for React applications
- **Framer Motion**: Production-ready motion library for React
- **Lucide React**: Beautifully simple icon library
- **React Hot Toast**: Responsive and accessible toast notifications

## 📋 Prerequisites

- **Node.js** (version 18 or higher recommended)

## 🔧 Installation & Setup

### 1. Clone the repository (if applicable)
```bash
git clone https://github.com/yourusername/nstore-e-catalog.git
cd nstore-e-catalog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following environment variables:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

For Supabase setup:
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Add the URL and anonymous key to your environment variables

### 4. Run the application
```bash
# Development mode
npm run dev

# The app will be running at http://localhost:3000
```

### 5. Build for production
```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

## 🏗️ Project Structure

```
nstore-e-catalog/
├── components/           # Reusable UI components
├── context/             # React Context providers (AuthContext)
├── hooks/               # Custom React hooks
├── pages/               # Page components (HomePage, ProductDetail, etc.)
│   └── admin/           # Admin-specific pages
├── public/              # Static assets
├── App.tsx              # Main application router
├── index.tsx            # Application entry point
├── types.ts             # Type definitions (Product, Category, etc.)
├── package.json         # Dependencies and scripts
└── vite.config.ts       # Vite configuration
```

## 📱 Available Pages

- **Home Page** (`/`): Main product catalog with filtering options
- **Product Detail Page** (`/product/:id`): Detailed view of individual products
- **Login Page** (`/login`): Authentication for admin access
- **Admin Dashboard** (`/admin`): Overview of all products (requires authentication)
- **Add Product** (`/admin/new`): Form to add new products (requires authentication)
- **Edit Product** (`/admin/edit/:id`): Form to edit existing products (requires authentication)
- **Not Found Page** (`*`): Error page for invalid routes

## 📝 Data Models

### Product
- `id`: Unique identifier
- `name`: Product name
- `category`: Product category (ALL, IPHONE, ANDROID, LAPTOP)
- `price`: Product price
- `description`: Product description
- `images`: Array of image URLs
- `stockStatus`: Availability status (READY, SOLD)

## 🔐 Authentication

Admin routes are protected using a PrivateRoute component. Access is granted only to authenticated users through the AuthContext.

## 💡 Key Components

- **AuthProvider**: Manages authentication state throughout the app
- **PrivateRoute**: Component wrapper for protecting admin routes
- **Toast Notifications**: User feedback for actions using react-hot-toast
- **Product Cards**: Display products in an attractive grid layout

## 🚀 Deployment

The application is optimized for deployment on platforms like Vercel, Netlify, or similar static hosting services.

### For Vercel:
1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add the environment variables in the Vercel dashboard
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the MIT License.


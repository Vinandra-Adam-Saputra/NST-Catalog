import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-20 backdrop-blur-md bg-slate-900/90 shadow-md border-b border-slate-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 👇 Logo + Text Brand di sebelah kiri */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/nst.jpg" 
              alt="NST Logo"
              className="h-12 w-auto object-contain" 
            />
            <span className="text-xl font-extrabold tracking-wide text-white">
              NST PHONESHOP
            </span>
          </Link>

          {/* 👇 Jika ingin ada menu navigasi atau icon ke depannya */}
          <nav className="hidden md:flex items-center gap-6">
            {/* contoh menu jika dibutuhkan */}
            {/* <Link to="/products" className="text-slate-300 hover:text-white transition">Produk</Link> */}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getAllProducts, Product } from '../services/productService'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'

const categories = ['Semua', 'iPhone', 'Android', 'Laptop']

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('Semua')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.status === 'Ready')
      .filter(
        (p) =>
          activeCategory === 'Semua' ||
          (p.kategori && p.kategori.toLowerCase() === activeCategory.toLowerCase())
      )
      .filter((p) =>
        p.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [products, activeCategory, searchTerm])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Header />

      {/* 🌟 Hero Section */}
      <section className="relative bg-gradient-to-r from-accent/20 via-accent/10 to-transparent py-16 md:py-24 rounded-b-3xl overflow-hidden shadow-sm">
        <div className="max-w-5xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4"
          >
            Gadget Berkualitas, <span className="text-accent">Harga Bersahabat</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto"
          >
            Temukan HP & Laptop second berkualitas dengan harga bersahabat 
          </motion.p>
          <motion.a
            href="#koleksi"
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full shadow-lg transition-all"
          >
            Jelajahi Koleksi
          </motion.a>
        </div>
      </section>

      {/* 🔍 Search & Filter */}
      <section
        id="koleksi"
        className="sticky top-16 z-20 backdrop-blur-md bg-white/80 py-4 shadow-sm mb-8 border-b border-slate-200"
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 border border-slate-200 rounded-full shadow-sm focus:ring-2 focus:ring-accent/40 focus:border-accent outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              🔍
            </span>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                  activeCategory === category
                    ? 'bg-accent text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

    {/* 🛍️ Produk Grid */}
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {loading ? (
        <Spinner />
      ) : (
        <motion.div
          key={activeCategory} // ✅ ini kuncinya
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-slate-500">
              Tidak ada produk ditemukan.
            </p>
          )}
        </motion.div>
      )}
    </main>


      <Footer />
    </div>
  )
}

export default HomePage

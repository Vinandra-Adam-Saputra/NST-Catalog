import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('produk')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching product:', error);
      } else if (data) {
        setProduct(data);
        setMainImage(data.gambar?.[0] || '');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Produk Tidak Ditemukan</h1>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-block bg-accent text-white px-6 py-2 rounded-md hover:bg-accent/90 transition-colors"
          >
            Kembali
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const WHATSAPP_NUMBER = '6285363619829';
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Halo, saya tertarik dengan produk ${product.nama_produk}. Apakah masih tersedia?`
  )}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mt-4 text-sm text-slate-500 mb-3 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="text-accent hover:underline transition-colors flex items-center gap-1"
        >
          ← Kembali
        </button>
        <span className="text-slate-400">/</span>
        <span className="text-slate-600">{product.nama_produk}</span>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gambar */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-100 rounded-2xl overflow-hidden shadow-sm w-full max-w-[500px] mx-auto"
              style={{ maxHeight: '600px' }}
            >
              <img
                src={mainImage || 'https://via.placeholder.com/400x400?text=No+Image'}
                alt={product.nama_produk}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {product.gambar?.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 w-full max-w-[500px]">
                {product.gambar.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`rounded-xl overflow-hidden border-2 transition-all ${
                      mainImage === img
                        ? 'border-accent'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.nama_produk} thumbnail ${i + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

            {/* Detail Produk */}
            <div className="flex flex-col space-y-6">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-slate-900">{product.nama_produk}</h1>
                <p className="text-2xl font-semibold text-accent">
                  Rp {product.harga ? product.harga.toLocaleString() : '0'}
                </p>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">Deskripsi</h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {product.deskripsi || 'Tidak ada deskripsi.'}
                  </p>
                </div>
              </div>

              {/* Tombol WhatsApp */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-medium transition-all shadow-md"
              >
                <MessageCircle size={20} />
                Hubungi via WhatsApp
              </a>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;

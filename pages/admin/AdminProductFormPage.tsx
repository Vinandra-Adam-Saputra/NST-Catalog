import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Spinner from '../../components/Spinner';
import {
  getProductById,
  createProduct,
  updateProduct,
  uploadImages,
  deleteImage,
} from '../../services/productService';
import type { Product } from '../../services/productService';
import toast from 'react-hot-toast';

const CATEGORY_OPTIONS = ['iPhone', 'Android', 'Laptop'];

const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(!!id);
  const [uploading, setUploading] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const data = await getProductById(id);
          if (data) setProduct(data);
        } catch (error) {
          console.error('Failed to fetch product:', error);
          toast.error('Gagal memuat data produk dari Supabase.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleDeleteImage = async (url: string) => {
    try {
      await deleteImage(url);
      setProduct((prev) => ({
        ...prev,
        gambar: prev.gambar?.filter((img) => img !== url),
      }));
      toast.success('Gambar dihapus!');
    } catch {
      toast.error('Gagal menghapus gambar.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setUploading(true);
      const fileInput = e.currentTarget.elements.namedItem('gambar') as HTMLInputElement;
      let imageUrls: string[] = product.gambar || [];

      if (fileInput?.files && fileInput.files.length > 0) {
        const imageFiles = Array.from(fileInput.files).filter((f) => f.type.startsWith('image/'));
        if (imageFiles.length === 0) {
          toast.error('File yang diunggah harus berupa gambar.');
          setUploading(false);
          return;
        }

        toast.loading('Mengunggah gambar...');
        const uploaded = await uploadImages(imageFiles);
        toast.dismiss();
        toast.success('Gambar berhasil diunggah!');
        imageUrls = [...imageUrls, ...uploaded];
      }

      const payload: Partial<Product> = {
        nama_produk: product.nama_produk || '',
        kategori: product.kategori || '',
        harga: product.harga ? Number(product.harga) : 0,
        deskripsi: product.deskripsi || '',
        status: product.status || 'Ready',
        gambar: imageUrls,
        thumbnail: imageUrls[0] || null,
      };

      if (isEditing && id) {
        await updateProduct(id, payload);
        toast.success('Produk berhasil diperbarui!');
      } else {
        await createProduct(payload as any);
        toast.success('Produk berhasil ditambahkan!');
      }

      setTimeout(() => navigate('/admin'), 800);
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Gagal menyimpan produk ke Supabase.');
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="p-8">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-slate-800">
            {isEditing ? 'Edit Produk' : 'Tambah Produk'}
          </h1>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 md:p-8 space-y-5"
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Product Name</label>
            <input
              type="text"
              required
              value={product.nama_produk || ''}
              onChange={(e) => setProduct({ ...product, nama_produk: e.target.value })}
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 focus:ring-accent focus:border-accent"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                value={product.kategori || ''}
                onChange={(e) => setProduct({ ...product, kategori: e.target.value })}
                className="mt-1 block w-full border border-slate-300 rounded-md p-2 bg-white"
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Price</label>
              <input
                type="text"
                required
                value={product.harga ? product.harga.toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setProduct({ ...product, harga: raw ? Number(raw) : 0 });
                }}
                className="mt-1 block w-full border border-slate-300 rounded-md p-2"
                placeholder="Misal 10.000"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={product.deskripsi || ''}
              onChange={(e) => setProduct({ ...product, deskripsi: e.target.value })}
              className="mt-1 block w-full border border-slate-300 rounded-md p-2"
              rows={4}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={product.status || 'Ready'}
              onChange={(e) => setProduct({ ...product, status: e.target.value as 'Ready' | 'Sold' })}
              className="mt-1 block w-full border border-slate-300 rounded-md p-2 bg-white"
            >
              <option value="Ready">Ready</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          {/* Upload Images */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Upload Images</label>
            <input type="file" name="gambar" multiple accept="image/*" className="mt-1" />
            {product.gambar && product.gambar.length > 0 && (
              <div className="mt-3 grid grid-cols-5 gap-3">
                {product.gambar.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="h-20 w-20 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(url)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2 px-4 text-white bg-accent hover:bg-accent-hover rounded-md transition-colors"
          >
            {uploading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminProductFormPage;

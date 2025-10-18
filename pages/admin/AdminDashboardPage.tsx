import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../../services/productService';
import type { Product } from '../../services/productService';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, LogOut } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Ready' | 'Sold'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = await getAllProducts(true);
      setProducts(data);
      setFilteredProducts(data);

      // 🟢 Ambil kategori unik untuk dropdown
      const uniqueCategories = Array.from(
        new Set(data.map((p) => p.kategori).filter(Boolean))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Gagal memuat data produk dari Supabase.');
    }
  }

  // 🔍 Filter gabungan: search + status + kategori
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const results = products.filter((p) => {
      const matchName = p.nama_produk.toLowerCase().includes(term);
      const matchCategory = p.kategori?.toLowerCase().includes(term);

      const matchStatus =
        statusFilter === 'All' || p.status === statusFilter;

      const matchCategoryFilter =
        categoryFilter === 'All' || p.kategori === categoryFilter;

      return (matchName || matchCategory) && matchStatus && matchCategoryFilter;
    });

    setFilteredProducts(results);
  }, [searchTerm, statusFilter, categoryFilter, products]);

  const handleDelete = (id: string) => {
    toast.custom((t) => (
      <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <div className="p-4">
          <p className="text-sm font-medium text-slate-800 mb-3">
            Yakin ingin menghapus produk ini?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                try {
                  await deleteProduct(id);
                  toast.dismiss(t.id);
                  toast.success('Produk berhasil dihapus!');
                  fetchProducts();
                } catch (error) {
                  console.error('Failed to delete product:', error);
                  toast.dismiss(t.id);
                  toast.error('Gagal menghapus produk.');
                }
              }}
              className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    ), { duration: 8000 });
  };

  const handleLogout = () => {
    localStorage.removeItem('sb:token');
    toast.success('Berhasil logout');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <h1 className="text-xl font-bold tracking-wide text-slate-800">
            🏠 Admin Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/new"
              className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-accent px-3 py-1.5 rounded-md hover:bg-accent/90 transition-colors"
            >
              <PlusCircle size={16} /> Tambah Produk
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>


      {/* Konten utama */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <input
            type="text"
            placeholder="Cari produk atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 border border-slate-300 rounded-md p-2"
          />

          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-300 rounded-md p-2 bg-white"
            >
              <option value="All">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'All' | 'Ready' | 'Sold')
              }
              className="border border-slate-300 rounded-md p-2 bg-white"
            >
              <option value="All">Semua Status</option>
              <option value="Ready">Ready</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        {/* Tabel Produk */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Thumbnail</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Nama Produk</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Kategori</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Harga</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2">
                      {p.gambar && p.gambar.length > 0 ? (
                        <img
                          src={p.gambar[0]}
                          alt={p.nama_produk}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-slate-200 rounded-md flex items-center justify-center text-slate-400 text-sm">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{p.nama_produk}</td>
                    <td className="px-4 py-2">{p.kategori}</td>
                    <td className="px-4 py-2">Rp {p.harga.toLocaleString('id-ID')}</td>
                    <td
                      className={`px-4 py-2 font-medium ${
                        p.status === 'Ready' ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {p.status}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <Link
                        to={`/admin/edit/${p.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;

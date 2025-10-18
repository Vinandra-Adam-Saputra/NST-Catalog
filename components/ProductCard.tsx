import * as React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../services/productService';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const mainImage = product.gambar?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <Link to={`/product/${product.id}`}>
      <div className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition cursor-pointer">
        <img src={mainImage} alt={product.nama_produk} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{product.nama_produk}</h3>
          <p className="text-gray-500 mb-1">{product.kategori || 'Tanpa kategori'}</p>
          <p className="font-bold mb-2">Rp {product.harga.toLocaleString()}</p>
          <span
            className={`text-sm px-2 py-1 rounded ${
              product.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {product.status}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

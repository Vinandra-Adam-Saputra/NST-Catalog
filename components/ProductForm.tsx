import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { Category, StockStatus } from '../types';
import { mockApi } from '../services/mockApi';
import Spinner from './Spinner';

interface ProductFormProps {
  product?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.IPHONE);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>(StockStatus.READY);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setDescription(product.description);
      setStockStatus(product.stockStatus);
      setImages(product.images);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setImages(imageUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newProductData = {
        id: product ? product.id : Date.now().toString(),
        name,
        category,
        price,
        description,
        stockStatus,
        images: images.length > 0 ? images : ['https://picsum.photos/800/600'],
      };

      if (product) {
        await mockApi.updateProduct(product.id, newProductData);
      } else {
        await mockApi.addProduct(newProductData);
      }
      navigate('/admin');
    } catch (err) {
      setError('Failed to save product. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Product Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm">
            {Object.values(Category).filter(c => c !== Category.ALL).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price ($)</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} required min="0" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" />
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" />
      </div>

      <div>
        <label htmlFor="stockStatus" className="block text-sm font-medium text-slate-700">Stock Status</label>
        <select id="stockStatus" value={stockStatus} onChange={(e) => setStockStatus(e.target.value as StockStatus)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm">
          {Object.values(StockStatus).map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Product Images</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div className="flex text-sm text-slate-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent">
                <span>Upload files</span>
                <input id="file-upload" name="file-upload" type="file" multiple onChange={handleImageChange} className="sr-only" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
          </div>
        </div>
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <img key={index} src={img} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end space-x-4">
        <button type="button" onClick={() => navigate('/admin')} className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50">
          {loading ? <Spinner /> : (product ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

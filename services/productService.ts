import { supabase } from './supabaseClient'

export interface Product {
  id: string
  nama_produk: string
  kategori?: string
  harga: number
  deskripsi?: string
  status: 'Ready' | 'Sold'
  gambar?: string[] // URLs
  thumbnail?: string // gambar utama
  created_at?: string
}

/** Get all products (optionally include Sold) */
export async function getAllProducts(includeSold = false): Promise<Product[]> {
  let query = supabase
    .from('produk')
    .select('*')
    .order('created_at', { ascending: false })

  if (!includeSold) {
    query = query.eq('status', 'Ready')
  }

  const { data, error } = await query
  if (error) throw error
  return (data as Product[]) ?? []
}

/** Get product by ID */
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('produk')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if ((error as any).code === 'PGRST116') return null // not found
    throw error
  }

  return data as Product
}

/** Upload files to Supabase Storage (bucket: product-images). Returns array of public URLs. */
export async function uploadImages(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) return []

  const uploadedUrls: string[] = []

  for (const file of files) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(uploadError.message)
    }

    const { data: publicUrl } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    if (publicUrl?.publicUrl) {
      uploadedUrls.push(publicUrl.publicUrl)
    }
  }

  return uploadedUrls
}

/** Create product (set thumbnail otomatis dari gambar pertama) */
export async function createProduct(
  payload: Omit<Product, 'id' | 'created_at'>
): Promise<Product> {
  const fixedPayload = {
    ...payload,
    gambar: payload.gambar && payload.gambar.length > 0 ? payload.gambar : [],
    thumbnail: payload.gambar?.[0] || null, // ✅ thumbnail otomatis
  }

  const { data, error } = await supabase
    .from('produk')
    .insert([fixedPayload])
    .select()
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    throw new Error(error.message)
  }

  return data as Product
}

/** Update existing product */
export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const fixedPayload = {
    ...payload,
    gambar: payload.gambar && payload.gambar.length > 0 ? payload.gambar : [],
    thumbnail: payload.gambar?.[0] || payload.thumbnail || null, // ✅ pastikan thumbnail ikut diupdate
  }

  const { data, error } = await supabase
    .from('produk')
    .update(fixedPayload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase update error:', error)
    throw new Error(error.message)
  }

  return data as Product
}

/** Delete product */
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('produk').delete().eq('id', id)
  if (error) throw error
}

/** Delete image from Supabase Storage */
export async function deleteImage(fileUrl: string): Promise<void> {
  try {
    const filePath = fileUrl.split('/').slice(-2).join('/') // ambil path dari URL
    const { error } = await supabase.storage.from('product-images').remove([filePath])
    if (error) throw error
    console.log('✅ Gambar berhasil dihapus:', filePath)
  } catch (err) {
    console.error('Gagal menghapus gambar:', err)
    throw err
  }
}

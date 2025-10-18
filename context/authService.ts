// src/services/authService.ts
import { supabase } from '../services/supabaseClient';

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function checkAuth() {
  const { data } = await supabase.auth.getSession();
  return !!data.session; // true jika sudah login
}

import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(AuthContext);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionUser, setSessionUser] = useState<any | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      const { data } = await supabase.auth.getSession();
      setSessionUser(data.session?.user ?? null);
      setCheckingSession(false);
    };

    verifySession();

    // Dengarkan perubahan sesi login
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
      setCheckingSession(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Jika masih loading atau sedang verifikasi
  if (loading || checkingSession) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Memeriksa sesi login...
      </div>
    );
  }

  // Jika tidak ada user (baik dari context maupun session Supabase)
  if (!user && !sessionUser) {
    return <Navigate to="/login" replace />;
  }

  // Jika login → render halaman admin
  return <>{children}</>;
};

export default PrivateRoute;

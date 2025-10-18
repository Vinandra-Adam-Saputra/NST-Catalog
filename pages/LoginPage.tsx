import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@nstore.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user) {
      navigate('/admin', { replace: true });
    }
  }, [auth?.user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await auth?.login(email, password);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Gagal login, periksa kembali email dan password');
    } finally {
      setLoading(false);
    }
  };

  if (auth?.loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Memeriksa sesi login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-wider text-slate-800">NSTORE</h1>
          <p className="text-slate-500 mt-2 text-sm">Admin Panel Login</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold rounded-lg text-white bg-accent hover:bg-accent/90 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading && <Spinner />}
            {!loading && 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

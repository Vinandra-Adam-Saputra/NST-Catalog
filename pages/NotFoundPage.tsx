import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-accent">404</h1>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Page Not Found</h2>
      <p className="mt-2 text-base text-slate-600">Sorry, we couldn’t find the page you’re looking for.</p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-block rounded-md border border-transparent bg-accent px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-accent-hover"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;



import React, { useState } from 'react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);

  const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('_token', csrf());

      const response = await fetch('/admin-login', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        window.location.href = data.redirect || '/admin-dashboard';
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden bg-white">
        {/* Left Side: Instructions */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center px-8 py-12 bg-gradient-to-br from-blue-50 to-cyan-50 border-r">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Official Admin Portal</h2>
          <p className="text-lg text-gray-700 mb-6 text-center">
            This portal is strictly for MRT system officials only.<br />
            Unauthorized access is prohibited.<br />
            Please use your official credentials to sign in.
          </p>
          <div className="mt-8 text-center">
            <div className="text-gray-600 font-medium mb-2">Not an official user?</div>
            <a href="/signin" className="inline-block px-6 py-2 border border-blue-500 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition">
              Go to Normal Sign In
            </a>
          </div>
        </div>
        {/* Right Side: Sign In Form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center px-8 py-12">
          <div className="w-full max-w-md">
            <div className="rounded-xl shadow-lg overflow-hidden bg-white">
              <div className="px-8 pt-8 pb-4" style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)', color: '#fff' }}>
                <h1 className="text-2xl font-bold mb-1">Admin Login</h1>
                <p className="text-sm opacity-90">Sign in to access the admin dashboard</p>
              </div>
              <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 flex flex-col gap-4">
                <input type="hidden" name="_token" value={csrf()} />
                {error && <div className="text-red-600 bg-red-50 rounded px-3 py-2 text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="admin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="123456"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <a href="#" className="text-sm text-blue-500 hover:underline">Forgot your password?</a>
                  <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Login</button>
                </div>
              </form>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

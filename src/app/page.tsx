"use client"; // This is required at the top for user interaction in Next.js

import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Your backend is running on port 8000
    const backendUrl = 'http://localhost:8000/token';

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your username and password.');
      }

    const data = await response.json();
// Store the token in the browser's localStorage
localStorage.setItem('authToken', data.access_token);
// Redirect to the dashboard
window.location.href = '/dashboard';
      // In a real app, you'd store this token securely (e.g., in an HttpOnly cookie)
      // and redirect the user to a dashboard. For now, we'll just display it.

    } catch (err: any) {
      setError(err.message); 
      
    }
  };

  // If the user is logged in, show a success message
  if (token) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-green-600">Login Successful!</h1>
          <p className="mb-4 text-gray-700">You are now logged in.</p>
          <div className="mt-4 rounded-md bg-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-800">Your Access Token:</p>
            <p className="break-words text-xs text-gray-600">{token}</p>
          </div>
        </div>
      </main>
    );
  }

  // Otherwise, show the login form
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Researcher Portal</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="researcher1"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="testpassword"
              required
            />
          </div>
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
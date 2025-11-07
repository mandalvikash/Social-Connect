import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Welcome to Social Media</h1>
        <p className="text-lg text-gray-600 mb-8">Connect with friends, share your life, and explore the world.</p>
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors">Login</Link>
          <Link to="/signup" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-300 transition-colors">Signup</Link>
        </div>
      </div>
    </div>
  );
}
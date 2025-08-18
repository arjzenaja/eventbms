'use client';

import React from 'react';
import Link from 'next/link';

const AdminNotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        
        {/* Admin Header with Badge */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-3 bg-slate-800 px-6 py-3 rounded-full mb-8 border border-slate-600">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-bold tracking-wider">ADMIN PANEL</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-slate-700 mb-4">404</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Admin Error Card */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-3xl p-10 mb-10 shadow-2xl">
          <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-500">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Resource Not Found
          </h2>
          <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto text-lg">
            The requested resource could not be found in the admin panel. 
            Please verify the URL or use the navigation menu below.
          </p>
        </div>

        {/* Admin Navigation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Link href="/admin" className="group">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-blue-500 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-500 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Dashboard</h3>
              <p className="text-slate-400 text-sm">Overview & Analytics</p>
            </div>
          </Link>

          <Link href="/admin/data" className="group">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-green-500 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-green-500 transition-colors">
                <span className="text-2xl">🗃️</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Data Management</h3>
              <p className="text-slate-400 text-sm">CRUD Operations</p>
            </div>
          </Link>

          <Link href="/admin/users" className="group">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-purple-500 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-500 transition-colors">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">User Management</h3>
              <p className="text-slate-400 text-sm">Accounts & Permissions</p>
            </div>
          </Link>

          <Link href="/admin/settings" className="group">
            <div className="bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-orange-500 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-orange-500 transition-colors">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Settings</h3>
              <p className="text-slate-400 text-sm">Configuration</p>
            </div>
          </Link>
        </div>

        {/* Admin Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
          <Link href="/admin">
            <button className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-blue-500 shadow-lg">
              ← Back to Dashboard
            </button>
          </Link>
          
          <Link href="/">
            <button className="px-10 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-slate-600 shadow-lg">
              🏠 Go to Main Site
            </button>
          </Link>
        </div>

        {/* Admin Status Bar */}
        <div className="bg-slate-800/80 border border-slate-600 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-300 font-medium">Admin Panel Active</span>
              <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
              <span className="text-slate-400 text-sm">Secure Connection</span>
            </div>
            <div className="text-slate-400 font-mono text-sm">
              v2.0.1 | Build #2024.01
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminNotFound;

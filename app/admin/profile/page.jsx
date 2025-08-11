'use client';

import { useAdmin } from '@/context/AdminContext';

export default function AdminProfilePage() {
  const { adminUser } = useAdmin();

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Profil Saya</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
            {adminUser?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-lg font-medium">{adminUser?.name || 'Admin'}</p>
            <p className="text-sm text-gray-500">{adminUser?.email || 'admin@test.com'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nama</p>
            <p className="font-medium">{adminUser?.name || 'Admin'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Peran</p>
            <p className="font-medium">{adminUser?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}



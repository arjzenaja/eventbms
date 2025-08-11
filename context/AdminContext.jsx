'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on page load
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (adminData) => {
    const withDefaults = {
      preferences: {
        theme: 'light',
        notifications: { email: true, push: false },
      },
      ...adminData,
    };
    setAdminUser(withDefaults);
    localStorage.setItem('adminUser', JSON.stringify(withDefaults));
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  const updateProfile = (partial) => {
    setAdminUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('adminUser', JSON.stringify(next));
      return next;
    });
  };

  const updatePreferences = (partial) => {
    setAdminUser((prev) => {
      const next = {
        ...prev,
        preferences: {
          theme: prev?.preferences?.theme ?? 'light',
          notifications: {
            email: prev?.preferences?.notifications?.email ?? true,
            push: prev?.preferences?.notifications?.push ?? false,
          },
          ...prev?.preferences,
          ...partial,
        },
      };
      localStorage.setItem('adminUser', JSON.stringify(next));
      return next;
    });
  };

  const isAuthenticated = () => {
    return adminUser !== null;
  };

  const hasRole = (role) => {
    return adminUser && adminUser.role === role;
  };

  const value = {
    adminUser,
    isLoading,
    login,
    logout,
    updateProfile,
    updatePreferences,
    isAuthenticated,
    hasRole
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

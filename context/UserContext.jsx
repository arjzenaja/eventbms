'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    const withDefaults = {
      preferences: {
        theme: 'light',
        notifications: { email: true, push: false },
      },
      ...userData,
    };
    setUser(withDefaults);
    localStorage.setItem('user', JSON.stringify(withDefaults));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const updatePreferences = (partial) => {
    setUser((prev) => {
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
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateProfile,
    updatePreferences,
    isAuthenticated,
    hasRole
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

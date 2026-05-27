// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { AuthUser } from '@/types/auth';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: { email: string; password: string; remember?: boolean }) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
  token: string | null;
  redirectBasedOnRole: () => void;
  checkAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
  token: null,
  redirectBasedOnRole: () => {},
  checkAccess: () => true,
});

// Helper functions for token management
const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

const setStoredToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

const removeStoredToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Helper function to get role from user data
const getUserRole = (userData: AuthUser | null): string => {
  if (!userData) return 'user';
  if (typeof userData.role === 'string') return userData.role.toLowerCase();
  if (Array.isArray(userData.role) && userData.role.length > 0) return userData.role[0].toLowerCase();
  return 'user';
};

// Function to determine route based on role
const getRoleBasedRoute = (role: string | string[] | undefined): string => {
  const roleStr = typeof role === 'string' ? role.toLowerCase() : 
                  Array.isArray(role) && role.length > 0 ? role[0].toLowerCase() : 'user';
  
  switch (roleStr) {
    case 'admin':
      return '/dashboard';
    case 'delivery':
      return '/DeliveryService';
    case 'company':
      return '/company';
    default:
      return '/';
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize token and try to restore user data on load
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
      
      // Try to restore user data from localStorage
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('✅ Auth initialized from storage:', parsedUser);
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }
    }
    setLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string; remember?: boolean }) => {
      const res = await apiFetch('login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return res;
    },
  onSuccess: (data) => {
  console.log('📦 Login response:', data);
  
  // ✅ Handle API response structure: { result, data: { user, token, token_type }, message, status }
  if (data.status === 200 && data.data?.token && data.data?.user) {
    // Save token
    setStoredToken(data.data.token);
    setToken(data.data.token);
    
    // Create user object with role from API response
    const userData: AuthUser = {
      id: data.data.user.id,
      name: data.data.user.name,
      email: data.data.user.email,
      phone: data.data.user.phone || '',
      address: '',
      remember: false,
      role: data.data.user.role || 'user', // ✅ Extract role from API response (will be 'admin')
      phoneExt: '',
      password: '',
      cell: '',
      created_at: data.data.user.created_at,
      updated_at: data.data.user.updated_at,
    };
    
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    
    console.log('✅ Token and user data saved to localStorage');
    console.log('👤 User role set to:', userData.role);
    console.log('🎯 Role-based route:', getRoleBasedRoute(userData.role));
    
    // ✅ Redirect based on role
    const targetPath = getRoleBasedRoute(userData.role);
    console.log(`🎯 Login successful, redirecting to: ${targetPath}`);
    
    // Use window.location for hard redirect if needed
    router.push(targetPath);
  } else {
    console.error('Login response missing expected data', data);
  }
},
    onError: (error) => {
      console.error('❌ Login mutation error:', error);
    },
  });

  const login = async (credentials: { email: string; password: string; remember?: boolean }) => {
    try {
      setLoading(true);
      await loginMutation.mutateAsync(credentials);
      return true;
    } catch (error) {
      console.error('❌ Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const currentToken = getStoredToken();
      if (currentToken) {
        try {
          await apiFetch('admin/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${currentToken}`,
            },
          });
        } catch (e) {
          console.log('Logout endpoint failed, continuing with client-side logout');
        }
      }
    } catch (error) {
      console.log('Logout API call failed, but proceeding anyway');
    }

    // Clear all stored data
    removeStoredToken();
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    queryClient.clear();
    
    // Redirect to Login page
    router.push('/auth');
  };

  const updateUser = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const checkIfNeedsRedirect = (currentPath: string, userRole: string | string[] | undefined): boolean => {
    const roleStr = typeof userRole === 'string' ? userRole.toLowerCase() : 
                    Array.isArray(userRole) && userRole.length > 0 ? userRole[0].toLowerCase() : '';
    const pathLower = currentPath?.toLowerCase() || '';
    
    const publicPaths = ['/auth', '/about', '/contact'];
    if (publicPaths.includes(pathLower) || pathLower.startsWith('/auth/')) {
      return false;
    }
    
    return false;
  };

  const redirectBasedOnRole = () => {
    if (user?.role) {
      const targetPath = getRoleBasedRoute(user.role);
      console.log(`🔄 Manually redirecting to: ${targetPath}`);
      router.push(targetPath);
    }
  };

  const checkAccess = (path: string): boolean => {
    if (!user?.role) return false;
    return !checkIfNeedsRedirect(path, user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        token,
        redirectBasedOnRole,
        checkAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
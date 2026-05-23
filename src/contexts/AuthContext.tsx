'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// ✅ Updated: Use a simpler approach - just validate token without complex endpoint
async function fetchUser(token: string): Promise<AuthUser | null> {
  try {
    // Since the check-auth endpoint doesn't exist, we can:
    // Option 1: Use a different endpoint that exists (like getting user profile)
    // Option 2: Return null and let the token be validated on each request
    
    console.log('🔐 Attempting to fetch user with token');
    
    // Try to get user data from a known working endpoint
    // For now, we'll return null and rely on the stored user data from login
    // You can implement a proper endpoint later like: /api/user/profile
    
    // Example of trying a different endpoint:
    // const res = await apiFetch('/back/user/profile', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // if (res && res.status === true && res.data) return res.data;
    
    // For now, return null - we'll use the user data from login
    return null;
  } catch (error) {
    console.log('❌ fetchUser error:', error);
    return null;
  }
}

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
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }
    }
    setLoading(false);
  }, []);

  // ✅ Simplified: Don't try to fetch user on every load since endpoint is broken
  // Just use the user data from login

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
      // ✅ Handle your API response structure
      if (data.token && data.status === true && data.data) {
        // Save token
        setStoredToken(data.token);
        setToken(data.token);
        
        // Save user data
        const userData = data.data as AuthUser;
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        console.log('✅ Token and user data saved to localStorage');
        
        // ✅ Redirect based on role
        const role = userData.role;
        if (role) {
          const targetPath = getRoleBasedRoute(role);
          console.log(`🎯 Login successful, redirecting ${role} to: ${targetPath}`);
          router.push(targetPath);
        }
      } else {
        console.error('Login response missing expected data', data);
      }
    },
    onError: (error) => {
      console.log('❌ Login mutation error:', error);
    },
  });

  const login = async (credentials: { email: string; password: string; remember?: boolean }) => {
    try {
      setLoading(true);
      await loginMutation.mutateAsync(credentials);
      return true;
    } catch (error) {
      console.log('❌ Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = getStoredToken();
      if (token) {
        // Try to call logout endpoint if it exists
        try {
          await apiFetch('admin/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
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

  // ✅ Function to determine route based on role
  const getRoleBasedRoute = (role: string): string => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '/';
      case 'delivery':
        return '/DeliveryService';
      default:
        return '/';
    }
  };

  // ✅ Check if user needs to be redirected
  const checkIfNeedsRedirect = (currentPath: string, userRole: string): boolean => {
    const roleLower = userRole?.toLowerCase();
    const pathLower = currentPath?.toLowerCase() || '';
    
    // Public pages - no redirect needed
    const publicPaths = ['/auth', '/about', '/contact'];
    if (publicPaths.includes(pathLower) || pathLower.startsWith('/auth/')) {
      return false;
    }
    
    // Delivery role restrictions
    if (roleLower === 'delivery') {
      // Redirect if trying to access admin or other non-delivery pages
      if (!pathLower.startsWith('/deliveryservice/') && pathLower !== '/deliveryservice') {
        return true;
      }
    }
    
    // Admin has access to everything
    return false;
  };

  // ✅ Function to redirect based on role
  const redirectBasedOnRole = () => {
    if (user?.role) {
      const targetPath = getRoleBasedRoute(user.role);
      console.log(`🔄 Manually redirecting ${user.role} to: ${targetPath}`);
      router.push(targetPath);
    }
  };

  // ✅ Function to check access permission
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
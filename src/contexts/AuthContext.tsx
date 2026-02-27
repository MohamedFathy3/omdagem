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

// دالة مساعدة للتعامل مع التوكن في localStorage
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

async function fetchUser(): Promise<AuthUser | null> {
  try {
    const token = getStoredToken();
    if (!token) {
      console.log('❌ No token found in localStorage');
      return null;
    }

    console.log('🔐 Using token from localStorage:', token.substring(0, 10) + '...');
    
    const res = await apiFetch('/get-admin', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📦 API Response:', res);
    
    if (res) {
      // ✅ دمج البيانات بشكل صحيح
      if (res.data && res.role) {
        // الحالة: { role: "admin", data: { ... } }
        return {
          ...res.data,
          role: res.role  // إضافة الـ role من الخارج
        } as AuthUser;
      }
      else if (res.data) {
        // الحالة: { data: { ... } } بدون role خارجي
        return res.data as AuthUser;
      }
      else if (res.admin) {
        // الحالة: { admin: { ... } }
        return res.admin as AuthUser;
      }
      else if (res.id) {
        // الحالة: object عادي
        return res as AuthUser;
      }
    }
    
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
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // تهيئة التوكن عند التحميل
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const { data: user, isLoading } = useQuery<AuthUser | null, Error>({
    queryKey: ['user', token],
    queryFn: fetchUser,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // ✅ للتشخيص - عرض الـ user object
  useEffect(() => {
    if (user) {
      console.log('👤 Final user object in AuthContext:', user);
      console.log('👤 User role:', user.role);
    }
  }, [user]);

  // ✅ التوجيه التلقائي بناء على الـ role
  useEffect(() => {
    if (!isLoading && user && initialCheckDone) {
      const role = Array.isArray(user.role) ? user.role[0] : user.role;
      console.log('👤 User role detected:', role);
      console.log('📍 Current path:', pathname);
      
      const shouldRedirect = checkPathAccess(pathname, role);
      if (shouldRedirect) {
        const targetPath = getRoleBasedRoute(role);
        console.log(`🔄 Redirecting ${role} to: ${targetPath}`);
        router.push(targetPath);
      }
    }
    
    if (!isLoading) {
      setInitialCheckDone(true);
    }
  }, [user, isLoading, pathname, router, initialCheckDone]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string; remember?: boolean }) => {
      const res = await apiFetch('admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return res;
    },
    onSuccess: (data) => {
      if (data.token) {
        setStoredToken(data.token);
        setToken(data.token);
        console.log('✅ Token saved to localStorage');
        queryClient.invalidateQueries({ queryKey: ['user'] });
        
        setTimeout(() => {
          if (data.role || data.data?.role) {
            const role = data.role || data.data?.role;
            const targetPath = getRoleBasedRoute(role);
            console.log(`🎯 Login successful, redirecting ${role} to: ${targetPath}`);
            router.push(targetPath);
          }
        }, 100);
      }
    },
  });

  const login = async (credentials: { email: string; password: string; remember?: boolean }) => {
    try {
      await loginMutation.mutateAsync(credentials);
      return true;
    } catch (error) {
      console.log('❌ Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = getStoredToken();
      if (token) {
        await apiFetch('admin-logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.log('Logout API call failed, but proceeding anyway');
    }

    removeStoredToken();
    setToken(null);
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.clear();
    
    window.location.href = '/auth';
  };

  const updateUser = (newUser: AuthUser) => {
    queryClient.setQueryData(['user'], newUser);
  };

  const getRoleBasedRoute = (role: string): string => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '/';
      case 'company':
        return '/company';
      default:
        return '/';
    }
  };

  const checkPathAccess = (path: string, role: string): boolean => {
    const roleLower = role?.toLowerCase();
    const pathLower = path?.toLowerCase();
    
    const publicPaths = ['/auth', '/', '/about', '/contact'];
    if (publicPaths.includes(path) || path.startsWith('/auth/')) {
      return false;
    }

    if (roleLower === 'company') {
      if (!pathLower.startsWith('/company') && !pathLower.startsWith('/product')) {
        return true;
      }
    }
    
    return false;
  };

  const redirectBasedOnRole = () => {
    if (user?.role) {
      const role = Array.isArray(user.role) ? user.role[0] : user.role;
      const targetPath = getRoleBasedRoute(role);
      console.log(`🔄 Redirecting ${role} to: ${targetPath}`);
      router.push(targetPath);
    }
  };

  const checkAccess = (path: string): boolean => {
    if (!user?.role) return false;
    const role = Array.isArray(user.role) ? user.role[0] : user.role;
    return !checkPathAccess(path, role);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
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
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];  // الأدوار المسموح لها بدخول الصفحة
  redirectTo?: string;        // المسار اللي يوجه له لو مش مسموح
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // لو لسه تحميل، نعمل حاجة
    if (loading) return;

    // لو مش مسجل دخول
    if (!user) {
      console.log('🔒 User not logged in, redirecting to login');
      router.push('/auth');
      return;
    }

    // تحويل role المستخدم لمصفوفة
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    
    // التحقق من صلاحية الوصول
    const hasAccess = userRoles.some(role => 
      allowedRoles.includes(role as UserRole)
    );

    if (!hasAccess) {
      console.log(`🚫 User role ${userRoles.join(', ')} not allowed to access this page`);
      console.log(`✅ Allowed roles: ${allowedRoles.join(', ')}`);
      
      // توجيه المستخدم للصفحة المناسبة حسب دوره
      if (userRoles.includes('admin')) {
        router.push('/');
      } else if (userRoles.includes('company')) {
        router.push('/product');
      } else {
        router.push(redirectTo);
      }
    }
  }, [user, loading, allowedRoles, redirectTo, router]);

  // عرض شاشة تحميل أثناء التحقق
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking access...</p>
        </div>
      </div>
    );
  }

  // لو مش مسموح له ومش عامل ريديركت لسه، نفضل في اللودينج
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // التحقق من الصلاحية مرة تانية للعرض
  const userRoles = Array.isArray(user.role) ? user.role : [user.role];
  const hasAccess = userRoles.some(role => 
    allowedRoles.includes(role as UserRole)
  );

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  // كل شيء تمام، نعرض المحتوى
  return <>{children}</>;
}
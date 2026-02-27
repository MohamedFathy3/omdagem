// lib/permissions.ts

// تعريف أنواع المستخدمين
export type UserRole = 'admin' | 'company';

// مسارات التطبيق مع الصلاحيات المطلوبة
export const routePermissions: Record<string, UserRole[]> = {
  '/': ['admin'],
  '/slider': ['admin'],
  '/engineer': ['admin'],
  '/user': ['admin'],
  '/maintenance': ['admin'],
  '/machine': ['admin'],
  '/merchant': ['admin'],
  '/design': ['admin'],
  '/seller': ['admin'],
  '/conectUs': ['admin'],
  '/company': ['admin'],
  '/product': ['company'],
};

// دالة للتحقق من صلاحية الوصول لمسار معين
export function getRequiredRolesForPath(path: string): UserRole[] {
  // إزالة أي query parameters أو trailing slash
  const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';
  
  return routePermissions[cleanPath] || ['admin', 'company']; // افتراضي يسمح للكل لو مش موجود
}
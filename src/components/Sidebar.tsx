'use client';

import { 
  Home, Database, Computer, Ship,
  ChevronDown, ChevronRight, 
  Clock, Package, Megaphone, User, Truck,
  LucideIcon
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import '../styles/globals.css';

// تعريف أنواع المستخدمين
type UserRole = 'admin' | 'company';

// تعريف العنصر الفرعي
type ChildItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
};

// تعريف عنصر القائمة الرئيسي
type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: ChildItem[];
  roles: UserRole[];
};

// جميع مسارات التطبيق في مكان واحد
const navItems: NavItem[] = [
  { name: 'Dashboard', icon: Home, href: '/', roles: ['admin'] },
  { name: 'Slider', icon: Clock, href: '/slider', roles: ['admin'] },
  { name: 'User', icon: User, href: '/user', roles: ['admin'] },
  { name: 'Company', icon: Database, href: '/company', roles: ['admin'] },
  { name: 'Engineer', icon: Computer, href: '/engineer', roles: ['admin'] },
  { name: 'Maintenance', icon: Truck, href: '/maintenance', roles: ['admin'] },
  { name: 'Machine', icon: Package, href: '/machine', roles: ['admin'] },
  { name: 'Merchant', icon: Database, href: '/merchant', roles: ['admin'] },
  { name: 'Design', icon: Package, href: '/design', roles: ['admin'] },
  { name: 'Seller', icon: Ship, href: '/seller', roles: ['admin'] },
  { name: 'ContactUs', icon: Megaphone, href: '/conectUs', roles: ['admin'] },
  { name: 'Products', icon: Database, href: '/product', roles: ['company'] },
];

export default function Sidebar({
  open,
  collapsed,
  onClose,
}: {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark') || 
                      localStorage.theme === 'dark' ||
                      (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.theme);
        setIsDarkMode(isDark);
      }
    };

    checkDarkMode();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => {
      mediaQuery.removeEventListener('change', checkDarkMode);
      observer.disconnect();
    };
  }, [mounted]);

  // ✅ دالة مبسطة لاستخراج الدور من user
  const getUserRoles = (): string[] => {
    if (!user) {
      console.log('❌ No user object');
      return [];
    }

    console.log('📦 Full user object:', user);
    
    // ✅ فقط نستخدم user.role لأنه موجود في الـ interface
    if (user.role) {
      const roleValue = user.role;
      console.log('✅ Found role in user.role:', roleValue);
      
      // تحويل الدور إلى مصفوفة
      const roles = Array.isArray(roleValue) ? roleValue : [roleValue];
      console.log('📊 Processed roles array:', roles);
      
      return roles;
    }
    
    console.log('❌ No role found in user object');
    return [];
  };

  const userRoles = getUserRoles();

  // فلترة عناصر القائمة حسب دور المستخدم
  const filterNavItemsByRole = (items: NavItem[]): NavItem[] => {
    console.log('🔍 Filtering with userRoles:', userRoles);
    
    if (userRoles.length === 0) {
      console.log('⚠️ No user roles, returning empty array');
      return [];
    }
    
    const filtered = items.filter(item => {
      const hasAccess = item.roles.some(role => userRoles.includes(role));
      console.log(`📌 Item ${item.name} (${item.roles}) -> hasAccess: ${hasAccess}`);
      return hasAccess;
    });

    console.log(`✅ Filtered items: ${filtered.length} out of ${items.length}`);
    return filtered;
  };

  const filteredNavItems = filterNavItemsByRole(navItems);

  const isItemActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href) ?? false;
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  if (!mounted) {
    return (
      <aside className={cn(
        'fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-900 border-r dark:border-gray-700',
        collapsed ? 'w-20' : 'w-60'
      )}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-900 border-r dark:border-gray-700',
          'transition-all duration-300 ease-in-out',
          'overflow-hidden',
          collapsed ? 'w-20' : 'w-60',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-auto'
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            {!collapsed ? (
              <div className="w-full flex items-center justify-center">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  System
                </h2>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <div className="text-lg font-extrabold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  E
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          

            <ul className="space-y-1 px-2">
              {filteredNavItems.map((item) => {
                const isActive = isItemActive(item.href);
                const Icon = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        collapsed && 'justify-center',
                        isActive
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                      onClick={() => {
                        if (collapsed && onClose) onClose();
                      }}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (
                        <span className="transition-opacity duration-300">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* رسالة إذا مفيش عناصر */}
            {filteredNavItems.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                <div>No menu items available</div>
                {userRoles.length > 0 ? (
                  <div className="text-xs mt-1">Role: {userRoles.join(', ')}</div>
                ) : (
                  <div className="text-xs mt-1 text-red-500">No role detected</div>
                )}
              </div>
            )}
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {!collapsed ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                <span>Version 1.0.0</span>
                {userRoles.length > 0 && (
                  <div className="mt-1 text-blue-600 dark:text-blue-400">
                    Role: {userRoles.join(', ')}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
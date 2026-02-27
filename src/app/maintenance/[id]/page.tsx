// app/back/user/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar,
  UserCircle,
  Shield,
  User,
  Clock
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface UserData {
  user: {
    name: string;
    phone: string;
    role: string;
    active: boolean;
  };
  id: number;
  name: string;
  phone: string;
  role: string;
  active: boolean;
  created_from: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchUserData();
    }
  }, [params.id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiFetch(`/maintenance/${params.id}`);
      
      if (data.result === 'Success') {
        setUser(data.data);
      } else {
        setError(data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Handle the date format "15-Dec-2025 18:23 PM"
      return dateString;
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading user data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {error ? 'Error Loading User' : 'User Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The user you are looking for does not exist.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/engineer')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Users
              </button>
              {error && (
                <button
                  onClick={fetchUserData}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/maintenance')}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">User Details</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: #{String(user.id).padStart(3, '0')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                    <UserCircle size={64} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.user.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.user.role)}`}>
                      {user.user.role === 'admin' ? 'Administrator' : 'User'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.user.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.user.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Phone size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.user.phone || 'Not provided'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <User size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Created From</div>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">{user.created_from}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Joined</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Clock size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatDate(user.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Account Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Shield size={20} className="text-blue-500" />
                      <span>User ID</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">#{user.id}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <User size={20} className="text-green-500" />
                      <span>Account Type</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white capitalize">{user.role}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar size={20} className="text-purple-500" />
                      <span>Status</span>
                    </div>
                    <span className={`font-bold ${
                      user.active ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="lg:col-span-2">
              <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Full Name</div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.user.name}</div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Phone Number</div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.user.phone || 'Not provided'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Account Details</h4>
                    <div className="space-y-3">
                     
                      
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Account Status</div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            user.active ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user.active ? 'Active Account' : 'Inactive Account'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Account Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <User size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Account Created</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Clock size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(user.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
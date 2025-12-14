// app/back/user/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Building,
  Home,
  Navigation
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';

interface UserData {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  role: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl: string | null;
  image: unknown | null;
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
      
      const data = await apiFetch(`/user/${params.id}`);
      
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
                onClick={() => router.push('/user')}
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
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/user')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">User Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                User ID: U{String(user.id).padStart(3, '0')}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.active
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {user.active ? 'Active' : 'Inactive'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'admin'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : user.role === 'merchant'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {user.role === 'admin' ? 'Administrator' : 
               user.role === 'merchant' ? 'Merchant' : 
               user.role === 'seller' ? 'Seller' : 
               'User'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {user.imageUrl ? (
                  <div className="relative">
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                      }}
                    />
                    <div className={`absolute bottom-4 right-4 p-1 rounded-full ${
                      user.active 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {user.active ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                    <User size={64} className="text-white" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : user.role === 'merchant'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : user.role === 'seller'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 
                     user.role === 'merchant' ? 'Merchant' : 
                     user.role === 'seller' ? 'Seller' : 
                     'User'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Phone size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Joined</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.createdAt}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Clock size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.updatedAt}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview Card */}
            {user.imageUrl && (
              <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile Image</h3>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-4">
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                      }}
                    />
                  </div>
                  <a
                    href={user.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Image URL
                  </a>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Default profile image</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - User Details */}
          <div className="lg:col-span-2">
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Building size={18} />
                      Basic Information
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Full Name</div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Phone Number</div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.phone}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Account Type</div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">{user.role}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Information */}
                  <div>
                    <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400">Account Status</h4>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Current Status</div>
                          <div className={`font-medium ${
                            user.active 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <div className={`p-2 rounded-full ${
                          user.active 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {user.active ? (
                            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle size={20} className="text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Timeline */}
                <div className="space-y-4">
                  {/* Location Information */}
                  {(user.address || user.city || user.state) && (
                    <div>
                      <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <MapPin size={18} />
                        Location Information
                      </h4>
                      <div className="space-y-3">
                        {user.address && (
                          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center gap-2 mb-1">
                              <Home size={16} className="text-gray-400" />
                              <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
                            </div>
                            <div className="font-medium text-gray-900 dark:text-white">{user.address}</div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-3">
                          {user.city && (
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="text-sm text-gray-500 dark:text-gray-400">City</div>
                              <div className="font-medium text-gray-900 dark:text-white">{user.city}</div>
                            </div>
                          )}
                          
                          {user.state && (
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="text-sm text-gray-500 dark:text-gray-400">State/Region</div>
                              <div className="font-medium text-gray-900 dark:text-white">{user.state}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline Information */}
                  <div>
                    <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400">Timeline</h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={16} className="text-gray-400" />
                          <div className="text-sm text-gray-500 dark:text-gray-400">Account Created</div>
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.createdAt}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={16} className="text-gray-400" />
                          <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.updatedAt}</div>
                      </div>
                    </div>
                  </div>

                  {/* Empty State for Location */}
                  {!user.address && !user.city && !user.state && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center gap-3">
                        <Navigation size={20} className="text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Location Information</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            No location details provided by the user
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Account Type</div>
                    <div className="font-bold text-lg text-gray-900 dark:text-white capitalize">{user.role}</div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    user.active
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-red-50 dark:bg-red-900/20'
                  }`}>
                    <div className={`text-sm ${
                      user.active
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    } mb-1`}>
                      Account Status
                    </div>
                    <div className={`font-bold text-lg ${
                      user.active
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Member Since</div>
                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                      {user.createdAt.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>

              {/* System Information */}
              
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
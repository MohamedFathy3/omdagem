// app/back/merchant/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  Building, 
  Facebook, 
  MessageCircle,
  Calendar,
  Clock,
  Edit,
  Trash2,
  UserCircle,
  CheckCircle,
  XCircle,
  Store,
  Globe
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';

interface MerchantData {
  id: number;
  name: string;
  phone: string;
  role: string;
  facebook_link: string | null;
  whatsapp_number: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl: string | null;
  image: unknown | null;
}

export default function MerchantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchMerchantData();
    }
  }, [params.id]);

  const fetchMerchantData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiFetch(`/merchant/${params.id}`);
      
      if (data.result === 'Success') {
        setMerchant(data.data);
      } else {
        setError(data.message || 'Failed to fetch merchant data');
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load merchant data');
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
            <p className="text-gray-600 dark:text-gray-400">Loading merchant data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !merchant) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {error ? 'Error Loading Merchant' : 'Merchant Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The merchant you are looking for does not exist.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/merchant')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Merchants
              </button>
              {error && (
                <button
                  onClick={fetchMerchantData}
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
              onClick={() => router.push('/merchant')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Merchant Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Merchant ID: M{String(merchant.id).padStart(3, '0')}
              </p>
            </div>
          </div>
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Merchant Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {merchant.imageUrl ? (
                  <div className="relative">
                    <img
                      src={merchant.imageUrl}
                      alt={merchant.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(merchant.name)}&background=random`;
                      }}
                    />
                    <div className={`absolute bottom-4 right-4 p-1 rounded-full ${
                      merchant.active 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {merchant.active ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <Store size={64} className="text-white" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{merchant.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    merchant.role === 'merchant'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {merchant.role === 'merchant' ? 'Merchant' : merchant.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    merchant.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {merchant.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Phone size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                    <div className="font-medium text-gray-900 dark:text-white">{merchant.phone}</div>
                  </div>
                </div>

                {merchant.whatsapp_number && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <MessageCircle size={20} className="text-green-500" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</div>
                      <div className="font-medium text-gray-900 dark:text-white">{merchant.whatsapp_number}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Joined</div>
                    <div className="font-medium text-gray-900 dark:text-white">{merchant.createdAt}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Clock size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                    <div className="font-medium text-gray-900 dark:text-white">{merchant.updatedAt}</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
           
            </div>

            {/* Social Links Card */}
            {(merchant.facebook_link || merchant.whatsapp_number) && (
              <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Social Links</h3>
                <div className="space-y-3">
                  {merchant.facebook_link && (
                    <a
                      href={merchant.facebook_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Facebook size={20} className="text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Facebook</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {merchant.facebook_link.replace('https://', '')}
                        </div>
                      </div>
                    </a>
                  )}

                  {merchant.whatsapp_number && (
                    <a
                      href={`https://wa.me/${merchant.whatsapp_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <MessageCircle size={20} className="text-green-600 dark:text-green-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">WhatsApp</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{merchant.whatsapp_number}</div>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Merchant Information</h3>
              
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
                        <div className="text-sm text-gray-500 dark:text-gray-400">Business Name</div>
                        <div className="font-medium text-gray-900 dark:text-white">{merchant.name}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Phone Number</div>
                        <div className="font-medium text-gray-900 dark:text-white">{merchant.phone}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Account Type</div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">{merchant.role}</div>
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
                            merchant.active 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {merchant.active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <div className={`p-2 rounded-full ${
                          merchant.active 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {merchant.active ? (
                            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle size={20} className="text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline & Additional Info */}
                <div className="space-y-4">
                  {/* Timeline Information */}
                  <div>
                    <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400">Timeline</h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={16} className="text-gray-400" />
                          <div className="text-sm text-gray-500 dark:text-gray-400">Account Created</div>
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">{merchant.createdAt}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={16} className="text-gray-400" />
                          <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">{merchant.updatedAt}</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div>
                    <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400">Contact Methods</h4>
                    <div className="space-y-2">
                      {merchant.whatsapp_number ? (
                        <a
                          href={`https://wa.me/${merchant.whatsapp_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                        >
                          <MessageCircle size={18} className="text-green-600 dark:text-green-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            WhatsApp: {merchant.whatsapp_number}
                          </span>
                        </a>
                      ) : (
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
                          <div className="text-gray-500 dark:text-gray-400">No WhatsApp number provided</div>
                        </div>
                      )}

                      {merchant.facebook_link ? (
                        <a
                          href={merchant.facebook_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Facebook size={18} className="text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-gray-900 dark:text-white truncate">
                            Facebook Profile
                          </span>
                        </a>
                      ) : (
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
                          <div className="text-gray-500 dark:text-gray-400">No Facebook link provided</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              {merchant.imageUrl && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400">Merchant Image</h4>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={merchant.imageUrl}
                        alt={merchant.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(merchant.name)}&background=random`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Image URL</div>
                      <a
                        href={merchant.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {merchant.imageUrl}
                      </a>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Default merchant logo image
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Note for Admin */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="text-blue-600 dark:text-blue-400 mt-1">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Admin Note</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      This merchant account can be activated or deactivated using the toggle button. 
                      {!merchant.facebook_link && !merchant.whatsapp_number && 
                        " Consider requesting social media links for better customer engagement."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
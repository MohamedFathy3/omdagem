// app/back/seller/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  Building, 
  MapPin, 
  Briefcase,
  Store,
  Calendar,
  Edit,
  Trash2,
  UserCircle,
  Image as ImageIcon,
  Shield
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';

interface SellerImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

interface SellerData {
  id: number;
  name: string;
  phone: string;
  role: string;
  address: string | null;
  state: string | null;
  city: string | null;
  nature_of_work: string | null;
  workshop_name: string | null;
  imageUrl: string | null;
  image: SellerImage | null;
}

export default function SellerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchSellerData();
    }
  }, [params.id]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiFetch(`/seller/${params.id}`);
      
      if (data.result === 'Success') {
        setSeller(data.data);
      } else {
        setError(data.message || 'Failed to fetch seller data');
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load seller data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeller = async () => {
    if (!seller || !confirm('Are you sure you want to delete this seller?')) return;
    
    try {
      const response = await apiFetch(`/back/seller/${seller.id}`, {
        method: 'DELETE',
      });
      
      if (response.result === 'Success') {
        router.push('/seller');
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading seller data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !seller) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {error ? 'Error Loading Seller' : 'Seller Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The seller you are looking for does not exist.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/seller')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Sellers
              </button>
              {error && (
                <button
                  onClick={fetchSellerData}
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
              onClick={() => router.push('/seller')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Seller Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seller ID: SL{String(seller.id).padStart(3, '0')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/back/seller/${seller.id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={18} />
              Edit Seller
            </button>
            <button
              onClick={handleDeleteSeller}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Seller Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {seller.imageUrl || seller.image?.fullUrl ? (
                  <div className="relative">
                    <img
                      src={seller.imageUrl || seller.image?.fullUrl}
                      alt={seller.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-500 mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}&background=random`;
                      }}
                    />
                    <div className="absolute bottom-4 right-4 bg-green-500 text-white p-1 rounded-full">
                      <Shield size={16} />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mb-4">
                    <Store size={64} className="text-white" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{seller.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
                    Verified Seller
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
                    {seller.role}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Phone size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                    <div className="font-medium text-gray-900 dark:text-white">{seller.phone}</div>
                  </div>
                </div>

                {seller.workshop_name && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Store size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Workshop Name</div>
                      <div className="font-medium text-gray-900 dark:text-white">{seller.workshop_name}</div>
                    </div>
                  </div>
                )}

                {seller.nature_of_work && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Briefcase size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Nature of Work</div>
                      <div className="font-medium text-gray-900 dark:text-white">{seller.nature_of_work}</div>
                    </div>
                  </div>
                )}

                {(seller.city || seller.state) && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <MapPin size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {seller.city}{seller.state ? `, ${seller.state}` : ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Details Card */}
            {seller.image && (
              <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <ImageIcon size={20} />
                  Image Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">File Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{seller.image.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{seller.image.mimeType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Size:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(seller.image.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Uploaded:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{seller.image.createdAt}</span>
                  </div>
                  <a
                    href={seller.image.fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 py-2 text-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    View Full Image
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Seller Information</h3>
              
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
                        <div className="text-sm text-gray-500 dark:text-gray-400">Company Name</div>
                        <div className="font-medium text-gray-900 dark:text-white">{seller.name}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Phone Number</div>
                        <div className="font-medium text-gray-900 dark:text-white">{seller.phone}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Role</div>
                        <div className="font-medium text-gray-900 dark:text-white">{seller.role}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Workshop Information */}
                  {seller.workshop_name && (
                    <div>
                      <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Store size={18} />
                        Workshop Information
                      </h4>
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Workshop Name</div>
                        <div className="font-medium text-gray-900 dark:text-white">{seller.workshop_name}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location & Work Details */}
                <div className="space-y-4">
                  {/* Location Information */}
                  {(seller.address || seller.city || seller.state) && (
                    <div>
                      <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <MapPin size={18} />
                        Location Information
                      </h4>
                      <div className="space-y-3">
                        {seller.address && (
                          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
                            <div className="font-medium text-gray-900 dark:text-white">{seller.address}</div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-3">
                          {seller.city && (
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="text-sm text-gray-500 dark:text-gray-400">City</div>
                              <div className="font-medium text-gray-900 dark:text-white">{seller.city}</div>
                            </div>
                          )}
                          
                          {seller.state && (
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="text-sm text-gray-500 dark:text-gray-400">State</div>
                              <div className="font-medium text-gray-900 dark:text-white">{seller.state}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nature of Work */}
                  {seller.nature_of_work && (
                    <div>
                      <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Briefcase size={18} />
                        Nature of Work
                      </h4>
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Type of Business</div>
                        <div className="font-medium text-gray-900 dark:text-white">{seller.nature_of_work}</div>
                      </div>
                    </div>
                  )}

                  {/* Empty State for Missing Information */}
                  {!seller.address && !seller.city && !seller.state && !seller.nature_of_work && !seller.workshop_name && (
                    <div className="p-6 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
                      <Store size={48} className="mx-auto mb-4 text-gray-400" />
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Information Needed</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This seller has not provided additional details yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Note for Admin */}
            <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600 dark:text-yellow-400 mt-1">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Admin Note</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Some information may be incomplete. Contact the seller to request additional details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
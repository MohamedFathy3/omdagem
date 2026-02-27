// app/back/used-machine/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  DollarSign, 
  Package, 
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface UserImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

interface MachineUser {
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
  imageUrl: string;
  image: UserImage;
}

interface MachineImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

interface MachineData {
  id: number;
  name: string;
  description: string;
  price: string;
  active: boolean;
  imageUrl: string;
  image: MachineImage;
  createdAt: string;
  updatedAt: string;
  user: MachineUser;
}

export default function UsedMachineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [machine, setMachine] = useState<MachineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'owner' | 'image'>('details');

  useEffect(() => {
    if (params.id) {
      fetchMachineData();
    }
  }, [params.id]);

  const fetchMachineData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiFetch(`/used-machine/${params.id}`);
      
      if (data.result === 'Success') {
        setMachine(data.data);
      } else {
        setError(data.message || 'Failed to fetch machine data');
      }
    } catch (error) {
      console.error('Error fetching machine data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load machine data');
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
            <p className="text-gray-600 dark:text-gray-400">Loading machine data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !machine) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {error ? 'Error Loading Machine' : 'Machine Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The machine you are looking for does not exist.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/used-machine')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Machines
              </button>
              {error && (
                <button
                  onClick={fetchMachineData}
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
              onClick={() => router.push('/machine')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Used Machine Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Machine ID: M{String(machine.id).padStart(3, '0')}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              machine.active
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {machine.active ? 'Active' : 'Inactive'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              parseFloat(machine.price) > 100 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              ${machine.price}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Machine Image & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Machine Image Card */}
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
              <div className="relative">
                <img
                  src={machine.imageUrl || machine.image?.fullUrl}
                  alt={machine.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Machine+Image';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    machine.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {machine.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{machine.name}</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <DollarSign size={18} />
                      <span>Price</span>
                    </div>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">${machine.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Package size={18} />
                      <span>Status</span>
                    </div>
                    <span className={`font-medium ${
                      machine.active
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {machine.active ? 'Available' : 'Sold/Unavailable'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <User size={18} />
                      <span>Owner</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{machine.user.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Details Card */}
            {machine.image && (
              <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <ImageIcon size={20} />
                  Image Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">File Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{machine.image.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{machine.image.mimeType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Size:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(machine.image.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Uploaded:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{machine.image.createdAt}</span>
                  </div>
                  <a
                    href={machine.image.fullUrl}
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
            {/* Tabs */}
            <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow mb-6">
              <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 min-w-[120px] py-4 text-center font-medium transition-colors ${
                    activeTab === 'details'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Info size={18} />
                    Machine Details
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('owner')}
                  className={`flex-1 min-w-[120px] py-4 text-center font-medium transition-colors ${
                    activeTab === 'owner'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User size={18} />
                    Owner Information
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`flex-1 min-w-[120px] py-4 text-center font-medium transition-colors ${
                    activeTab === 'image'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ImageIcon size={18} />
                    Image Details
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Machine Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Basic Details</h4>
                            <div className="space-y-3">
                              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Machine Name</div>
                                <div className="font-medium text-gray-900 dark:text-white">{machine.name}</div>
                              </div>
                              
                              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Price</div>
                                <div className="font-bold text-xl text-gray-900 dark:text-white">${machine.price}</div>
                              </div>
                              
                              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                                <div className="flex items-center gap-2">
                                  {machine.active ? (
                                    <>
                                      <CheckCircle size={16} className="text-green-500" />
                                      <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle size={16} className="text-red-500" />
                                      <span className="font-medium text-red-600 dark:text-red-400">Inactive</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Timeline</h4>
                            <div className="space-y-3">
                              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center gap-2 mb-1">
                                  <Calendar size={16} className="text-gray-400" />
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Created At</div>
                                </div>
                                <div className="font-medium text-gray-900 dark:text-white">{machine.createdAt}</div>
                              </div>
                              
                              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock size={16} className="text-gray-400" />
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                                </div>
                                <div className="font-medium text-gray-900 dark:text-white">{machine.updatedAt}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <FileText size={18} />
                        Description
                      </h4>
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {machine.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'owner' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Owner Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Basic Information</h4>
                          <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Owner Name</div>
                              <div className="font-medium text-gray-900 dark:text-white">{machine.user.name}</div>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Phone Number</div>
                              <div className="font-medium text-gray-900 dark:text-white">{machine.user.phone}</div>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Account Type</div>
                              <div className="font-medium text-gray-900 dark:text-white capitalize">{machine.user.role}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Account Status</h4>
                          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                                <div className={`font-medium ${
                                  machine.user.active 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {machine.user.active ? 'Active' : 'Inactive'}
                                </div>
                              </div>
                              <div className={`p-2 rounded-full ${
                                machine.user.active 
                                  ? 'bg-green-100 dark:bg-green-900/30' 
                                  : 'bg-red-100 dark:bg-red-900/30'
                              }`}>
                                {machine.user.active ? (
                                  <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                                ) : (
                                  <XCircle size={20} className="text-red-600 dark:text-red-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Location Information</h4>
                          <div className="space-y-3">
                            {(machine.user.address || machine.user.city || machine.user.state) ? (
                              <>
                                {machine.user.address && (
                                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                    <div className="flex items-center gap-2 mb-1">
                                      <MapPin size={16} className="text-gray-400" />
                                      <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
                                    </div>
                                    <div className="font-medium text-gray-900 dark:text-white">{machine.user.address}</div>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-2 gap-3">
                                  {machine.user.city && (
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                      <div className="text-sm text-gray-500 dark:text-gray-400">City</div>
                                      <div className="font-medium text-gray-900 dark:text-white">{machine.user.city}</div>
                                    </div>
                                  )}
                                  
                                  {machine.user.state && (
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                      <div className="text-sm text-gray-500 dark:text-gray-400">State</div>
                                      <div className="font-medium text-gray-900 dark:text-white">{machine.user.state}</div>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
                                <div className="text-gray-500 dark:text-gray-400">No location information provided</div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Timeline</h4>
                          <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar size={16} className="text-gray-400" />
                                <div className="text-sm text-gray-500 dark:text-gray-400">Created At</div>
                              </div>
                              <div className="font-medium text-gray-900 dark:text-white">{machine.user.createdAt}</div>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock size={16} className="text-gray-400" />
                                <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                              </div>
                              <div className="font-medium text-gray-900 dark:text-white">{machine.user.updatedAt}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Owner Image Preview */}
                    {machine.user.imageUrl && (
                      <div>
                        <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Owner Image</h4>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <div className="w-16 h-16 flex-shrink-0">
                            <img
                              src={machine.user.imageUrl}
                              alt={machine.user.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(machine.user.name)}&background=random`;
                              }}
                            />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Image URL</div>
                            <a
                              href={machine.user.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all text-sm"
                            >
                              {machine.user.imageUrl.length > 50 
                                ? `${machine.user.imageUrl.substring(0, 50)}...` 
                                : machine.user.imageUrl}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'image' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Image Details</h3>
                    
                    {machine.image ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
                            <img
                              src={machine.image.fullUrl}
                              alt={machine.name}
                              className="w-full h-64 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Machine+Image';
                              }}
                            />
                          </div>
                          <a
                            href={machine.image.fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Open Full Image
                          </a>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">File Name</div>
                            <div className="font-medium text-gray-900 dark:text-white">{machine.image.name}</div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">File Type</div>
                            <div className="font-medium text-gray-900 dark:text-white">{machine.image.mimeType}</div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">File Size</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {(machine.image.size / 1024).toFixed(2)} KB
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Upload Date</div>
                            <div className="font-medium text-gray-900 dark:text-white">{machine.image.createdAt}</div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Preview URL</div>
                            <a
                              href={machine.image.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all text-sm"
                            >
                              {machine.image.previewUrl}
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4 text-gray-400">🖼️</div>
                        <p className="text-gray-500 dark:text-gray-400">No detailed image information available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
        </ProtectedRoute>

  );
}
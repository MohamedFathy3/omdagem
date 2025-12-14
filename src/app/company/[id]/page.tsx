// app/back/company/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  Building, 
  MapPin, 
  Mail,
  Calendar,
  Clock,
  Users,
  Package,
  CheckCircle,
  XCircle,
  FileText,
  Globe
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';

interface CompanyImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

interface CompanyProduct {
  id: number;
  name: string;
  // يمكن إضافة المزيد من حقول المنتج
}

interface CompanyData {
  id: number;
  role: string;
  company_name: string | null;
  company_description: string | null;
  phone: string;
  company_address: string | null;
  active: boolean;
  products: CompanyProduct[];
  createdAt: string;
  updatedAt: string;
  imageUrl: string | null;
  image: CompanyImage | null;
  name?: string; // contact person name
  email?: string; // contact email
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchCompanyData();
    }
  }, [params.id]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiFetch(`/user/${params.id}`);
      
      if (data.result === 'Success') {
        setCompany(data.data);
      } else {
        setError(data.message || 'Failed to fetch company data');
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load company data');
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
            <p className="text-gray-600 dark:text-gray-400">Loading company data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !company) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {error ? 'Error Loading Company' : 'Company Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The company you are looking for does not exist.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/company')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Companies
              </button>
              {error && (
                <button
                  onClick={fetchCompanyData}
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
              onClick={() => router.push('/company')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Company Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Company ID: C{String(company.id).padStart(3, '0')}
              </p>
            </div>
          </div>
          
          {/* Status Badges */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              company.role === 'merchant'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {company.role === 'merchant' ? 'Company' : company.role}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              company.active
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {company.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {company.imageUrl || company.image?.fullUrl ? (
                  <div className="relative">
                    <img
                      src={company.imageUrl || company.image?.fullUrl}
                      alt={company.company_name || 'Company'}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.company_name || 'Company')}&background=random`;
                      }}
                    />
                    <div className={`absolute bottom-4 right-4 p-1 rounded-full ${
                      company.active 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {company.active ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                    <Building size={64} className="text-white" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {company.company_name || 'No Company Name'}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    company.role === 'merchant'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {company.role === 'merchant' ? 'Company' : company.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    company.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {company.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Phone size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                    <div className="font-medium text-gray-900 dark:text-white">{company.phone}</div>
                  </div>
                </div>

                {company.name && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Users size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Contact Person</div>
                      <div className="font-medium text-gray-900 dark:text-white">{company.name}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {(company.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Clock size={20} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      { (company.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Stats */}
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package size={20} />
                Products Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600 dark:text-gray-400">Total Products</div>
                  <div className="font-bold text-xl text-gray-900 dark:text-white">
                    {company.products?.length || 0}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  {company.products?.length > 0 ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      This company has {company.products.length} registered products
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No products registered yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Company Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Building size={18} />
                      Company Details
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Company Name</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {company.company_name || 'Not Provided'}
                        </div>
                      </div>
                      
                      {company.name && (
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Contact Person</div>
                          <div className="font-medium text-gray-900 dark:text-white">{company.name}</div>
                        </div>
                      )}
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Phone Number</div>
                        <div className="font-medium text-gray-900 dark:text-white">{company.phone}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Account Type</div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                          {company.role === 'merchant' ? 'Company (Merchant)' : company.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Information */}
                  <div>
                    <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400">Account Status</h4>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                          <div className={`font-medium ${
                            company.active 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {company.active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <div className={`p-2 rounded-full ${
                          company.active 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {company.active ? (
                            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle size={20} className="text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Description */}
                <div className="space-y-4">
                  {/* Location Information */}
                  {company.company_address && (
                    <div>
                      <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <MapPin size={18} />
                        Location
                      </h4>
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Company Address</div>
                        <div className="font-medium text-gray-900 dark:text-white">{company.company_address}</div>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {company.company_description && (
                    <div>
                      <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <FileText size={18} />
                        Company Description
                      </h4>
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {company.company_description}
                        </p>
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
                        <div className="font-medium text-gray-900 dark:text-white">
                          {(company.createdAt)}
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={16} className="text-gray-400" />
                          <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {(company.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              {company.products && company.products.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Package size={18} />
                    Registered Products
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {company.products.map((product) => (
                      <div key={product.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Product ID: {product.id}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Section */}
              {company.image && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400">Company Logo</h4>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={company.image.fullUrl}
                        alt={company.company_name || 'Company Logo'}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.company_name || 'Company')}&background=random`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Image Details</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <div>Name: {company.image.name}</div>
                        <div>Type: {company.image.mimeType}</div>
                        <div>Size: {(company.image.size / 1024).toFixed(2)} KB</div>
                        <div>Uploaded: {company.image.createdAt}</div>
                      </div>
                      <a
                        href={company.image.fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Full Image
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
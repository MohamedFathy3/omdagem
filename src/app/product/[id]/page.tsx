'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Package, 
  Calendar,
  Clock,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  Info,
  Globe,
  Building,
  Hash
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';

interface ProductImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

interface ProductData {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  image: ProductImage;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'image'>('details');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    if (params.id) {
      fetchProductData(isMounted);
    }
    
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  const fetchProductData = async (isMounted = true) => {
    try {
      setLoading(true);
      setError(null);
      setImageError(false);
      
      const data = await apiFetch(`/product/${params.id}`);
      
      if (isMounted) {
        if (data.result === 'Success') {
          setProduct(data.data);
        } else {
          setError(data.message || 'Failed to fetch product data');
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      if (isMounted) {
        setError(error instanceof Error ? error.message : 'Failed to load product data');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
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
            <p className="text-gray-600 dark:text-gray-400">Loading product data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {error ? 'Error Loading Product' : 'Product Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The product you are looking for does not exist.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/product')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Products
              </button>
              {error && (
                <button
                  onClick={() => fetchProductData()}
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
              onClick={() => router.push('/product')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors"
              aria-label="Go back to products"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Product Details</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Product ID: P{String(product.id).padStart(3, '0')}
              </p>
            </div>
          </div>
          
          {/* Status & Info Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <span className="flex items-center gap-1">
                <Building size={14} />
                Product
              </span>
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              Created: {formatDate(product.createdAt)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Image & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Image Card */}
            <div className="rounded-xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
              <div className="relative">
                <img
                  src={imageError 
                    ? 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Product+Image' 
                    : product.imageUrl || product.image?.fullUrl
                  }
                  alt={product.name}
                  className="w-full h-64 object-cover"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                    Product
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 truncate">{product.name}</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Hash size={18} />
                    <span className="font-medium">ID:</span>
                    <span className="font-bold text-gray-900 dark:text-white">P{String(product.id).padStart(3, '0')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar size={18} />
                    <span className="font-medium">Created:</span>
                    <span className="text-gray-900 dark:text-white">{formatDate(product.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Globe size={18} />
                    <span className="font-medium">Type:</span>
                    <span className="text-gray-900 dark:text-white">Company Product</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
          
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
                    Product Details
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
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Product Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Basic Details</h4>
                            <div className="space-y-3">
                              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Product Name</div>
                                <div className="font-medium text-gray-900 dark:text-white text-lg">{product.name}</div>
                              </div>
                              
                              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Product ID</div>
                                <div className="font-bold text-gray-900 dark:text-white">
                                  P{String(product.id).padStart(5, '0')}
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
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {formatDate(product.createdAt)}
                                </div>
                              </div>
                              
                              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock size={16} className="text-gray-400" />
                                  <div className="text-sm text-gray-500 dark:text-gray-400">Database Format</div>
                                </div>
                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                  {product.createdAt}
                                </div>
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
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 min-h-[100px]">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {product.description || 'No description provided for this product.'}
                        </p>
                      </div>
                    </div>

                    {/* Image Preview Section */}
                    <div>
                      <h4 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Product Image</h4>
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                              <img
                                src={product.imageUrl || product.image?.fullUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                                loading="lazy"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Image URL</div>
                            <a
                              href={product.imageUrl || product.image?.fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all text-sm block mb-2"
                            >
                              {product.imageUrl || product.image?.fullUrl}
                            </a>
                            <button
                              onClick={() => navigator.clipboard.writeText(product.imageUrl || product.image?.fullUrl || '')}
                              className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              Copy URL
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'image' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Image Details</h3>
                    
                    {product.image ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4 border border-gray-200 dark:border-gray-600">
                            <img
                              src={product.image.fullUrl}
                              alt={product.name}
                              className="w-full h-64 object-cover"
                              onError={() => setImageError(true)}
                              loading="lazy"
                            />
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={product.image.fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Open Full Image
                            </a>
                            <button
                              onClick={() => navigator.clipboard.writeText(product.image.fullUrl)}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                              title="Copy URL"
                            >
                              📋
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">File Name</div>
                            <div className="font-medium text-gray-900 dark:text-white truncate">{product.image.name}</div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">File Type</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm">
                                {product.image.mimeType}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">File Size</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm">
                                {(product.image.size / 1024).toFixed(2)} KB
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Upload Date</div>
                            <div className="font-medium text-gray-900 dark:text-white">{product.image.createdAt}</div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Preview URL</div>
                            <a
                              href={product.image.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all text-sm block"
                            >
                              {product.image.previewUrl}
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

            {/* Stats & Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400">Image Type</div>
                <div className="font-bold text-gray-900 dark:text-white mt-1">
                  {product.image?.mimeType.split('/')[1]?.toUpperCase() || 'WEBP'}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400">File Size</div>
                <div className="font-bold text-gray-900 dark:text-white mt-1">
                  {product.image ? `${(product.image.size / 1024).toFixed(2)} KB` : 'N/A'}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
                <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                <div className="font-bold text-gray-900 dark:text-white mt-1">
                  {formatDate(product.createdAt).split(' at ')[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
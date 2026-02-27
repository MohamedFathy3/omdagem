// app/products/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MediaOrUploadSelector } from "@/components/Tablecomponents/MediaOrUploadSelector";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  // استخراج company_id من المستخدم
  useEffect(() => {
    if (!loading && user) {
      console.log('👤 Current user:', user);
      
      // المستخدم هنا هو شركة، يبقى الـ id بتاعه هو company_id
      if (user.id) {
        setCompanyId(user.id);
        console.log('✅ Company ID set to:', user.id);
      }
      
      setIsReady(true);
    }
  }, [user, loading]);

  // عرض شاشة تحمين لو لسه بنحضر البيانات
  if (loading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  const handleViewUser = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <ProtectedRoute allowedRoles={['company']}>
      <GenericDataManager
        endpoint="product"
        title="Product"
        
        // ✅ إضافة الفلتر التلقائي باستخدام company_id
        filters={companyId ? { company_id: companyId } : {}}
        
        // ✅ منع التحميل لو مفيش company_id
        disableAutoFetch={!companyId}
        
        // ✅ رسالة لو مفيش company_id
        noDataMessage={!companyId ? "No company ID found. Please contact support." : undefined}
        
        columns={[
          { 
            key: 'id', 
            label: 'ID', 
            sortable: true,
            render: (item) => (
              <span className="font-mono">PRD{String(item.id).padStart(3, '0')}</span>
            )
          },
          { 
            key: 'name', 
            label: 'Name', 
            sortable: true,
            render: (item) => (
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">{item.name || 'No Name'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description?.substring(0, 50)}...
                  </div>
                </div>
              </div>
            )
          },
          { 
            key: 'description', 
            label: 'Description', 
            sortable: false,
          },
          {
            key: "imageUrl",
            label: "Image",
            sortable: false,
            render: (row) => (
              <img 
                src={row.imageUrl || '/placeholder-image.jpg'} 
                alt={row.name || "Product Image"}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
              <button
                onClick={() => handleViewUser(item.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Eye size={16} />
                View Details
              </button>
            )
          }
        ]}

        additionalData={[
          { key: 'engineer', endpoint: '/engineer' },
        ]}

        formFields={[
          { 
            name: 'name', 
            label: 'Product Name', 
            type: 'text', 
            required: true,
            placeholder: 'Enter product name'
          },
          {
            name: 'description',
            label: 'Description',
            type: 'text',
            required: true,
            placeholder: 'Enter description',
          },
          {
            name: "image",
            label: "Product Image",
            type: "custom",
            component: MediaOrUploadSelector,
            useExistingMedia: true,
            mediaType: "image",
            required: true,
            allowUpload: true,
          },
        ]}

        // ✅ إضافة company_id تلقائياً عند إنشاء منتج جديد
        initialData={companyId ? { company_id: companyId } : {}}

        showAddButton={true}
        showEditButton={true}
        showDeleteButton={true}
        showBulkActions={true}
        showDeletedToggle={true}
      />
    </ProtectedRoute>
  );
}
// app/products/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { MultiImageUploader } from "@/components/Tablecomponents/MultiImageUploader";
import { MediaOrUploadSelector } from "@/components/Tablecomponents/MediaOrUploadSelector"; // 🔥 استيراد MediaSelector
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProductsPage() {
  return (
      <ProtectedRoute allowedRoles={['admin']}>
    <GenericDataManager
      endpoint="slider"
      title="Slider"
      columns={[
   
        { 
          key: 'text', 
          label: 'text Name', 
          sortable: true 
        },
        { 
          key: 'description', 
          label: 'description', 
          sortable: true,
          render: (item) => `${item.currency || 'EGP'} ${item.price}`
        },
    {
        key: "imageUrl",
        label: "Image",
        sortable: false,
        render: (row) => (
          <img 
            src={row.imageUrl} 
            alt={row.text || "Slider Image"}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )
      },
      ]}

     
      
      formFields={[
        { 
          name: 'text', 
          label: 'Product Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter product name'
        },
        
        { 
          name: 'description', 
          label: 'description', 
          type: 'text', 
          required: false,
          placeholder: 'Enter description'
        },
     
            {
        name: "image",
        label: "Slider Image",
        type: "custom",
        component: MediaOrUploadSelector, // ✅ استخدم MediaSelector مباشرة
        useExistingMedia: true, // ✅ أضف هذه الخاصية
        mediaType: "image", // ✅ نوع الوسائط
        required: true,
        allowUpload: true,
      },
   

      
      ]}

      showAddButton={true}
      showEditButton={true}
      showDeleteButton={true}
      showBulkActions={true}
      showDeletedToggle={true}
      
      // فلترز إضافية
      availableFilters={[
        {
          key: 'name',
          label: 'Product Name',
          type: 'text',
          placeholder: 'Search by product name...'
        },
        {
          key: 'category',
          label: 'Category',
          type: 'text',
          placeholder: 'Search by category...'
        },
        {
          key: 'active',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' }
          ]
        },
       
      ]}
    />
    
  </ProtectedRoute>
);
}
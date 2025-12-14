// app/products/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { MultiImageUploader } from "@/components/Tablecomponents/MultiImageUploader";
import { Eye, Search, Filter, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MediaOrUploadSelector } from "@/components/Tablecomponents/MediaOrUploadSelector"; // 🔥 استيراد MediaSelector


export default function ProductsPage() {
      const router = useRouter();

      const handleViewUser = (userId: number) => {
    router.push(`/product/${userId}`);
  };

  return (
      <GenericDataManager
            endpoint="product"
            title="Product"
            columns={[
              { 
                key: 'id', 
                label: 'ID', 
                sortable: true,
                render: (item) => (
                  <span className="font-mono">US{String(item.id).padStart(3, '0')}</span>
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
                        {item.email}
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
            src={row.imageUrl} 
            alt={row.text || "maintenance Image"}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )
      },
            
           
          
              {
                key: 'actions',
                label: 'Actions',
                render: (item) => (
                  <button
                    onClick={() => handleViewUser(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      
                     'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
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
    />
  );
}
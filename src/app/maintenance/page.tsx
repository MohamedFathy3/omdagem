// app/products/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { MultiImageUploader } from "@/components/Tablecomponents/MultiImageUploader";
import { Eye, Search, Filter, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MediaOrUploadSelector } from "@/components/Tablecomponents/MediaOrUploadSelector"; // 🔥 استيراد MediaSelector
import ProtectedRoute from '@/components/ProtectedRoute';


export default function ProductsPage() {
      const router = useRouter();

      const handleViewUser = (userId: number) => {
    router.push(`/maintenance/${userId}`);
  };

  return (
        <ProtectedRoute allowedRoles={['admin']}>

      <GenericDataManager
            endpoint="maintenance"
            title="maintenance"
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
                      <div className="font-medium">{item.user.name || 'No Name'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.email}
                      </div>
                    </div>
                  </div>
                )
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
  { 
    key: 'engineer', 
    endpoint: '/engineer',
    filters: {
      role: 'engineer', // لجلب المهندسين النشطين فقط
    }
  },      ]}
     formFields={[
        { 
          name: 'problem_details', 
          label: 'problem_details Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter problem_details name'
        },
         { 
          name: 'report', 
          label: 'report', 
          type: 'textarea', 
          required: true,
          placeholder: 'Enter report '
        },
          { 
          name: 'status', 
          label: 'status', 
          type: 'select', 
          required: false,
          options: [
    { value: 'pending', label: 'pending' },      // سعودي
    { value: 'in_progress', label: 'in_progress' },      // إماراتي
 
    { value: 'completed', label: 'completed' }  
          ],
          defaultValue: 'pending'
        },
       {
          name: 'engineer_id',
          label: 'engineer',
          type: 'select',
          optionsKey: 'engineer',
          required: true,
          placeholder: 'Select engineer',
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



            showAddButton={false}
            showEditButton={true}
            showDeleteButton={true}
            showBulkActions={true}
            showDeletedToggle={true}
    />
        </ProtectedRoute>

  );
}
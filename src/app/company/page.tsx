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
    router.push(`/company/${userId}`);
  };

  return (
      <GenericDataManager
            endpoint="company"
            title="Company"
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
                key: 'company_name', 
                label: 'company_name', 
                sortable: true,
                render: (item) => (
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {item.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{item.company_name || 'No Name'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.company_description}
                      </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.company_address}
                      </div>
                    </div>
                  </div>
                )
              },
           { 
                key: 'phone', 
                label: 'phone', 
                sortable: true,
           
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

     formFields={[
        { 
          name: 'company_name', 
          label: 'company_name Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter company_name '
        },
          { 
          name: 'company_description', 
          label: 'company_description', 
          type: 'text', 
          required: false,
          
        },
       {
          name: 'company_address',
          label: 'company_address',
          type: 'text',
      
          required: true,
          placeholder: ' company_address',
        },
          {
          name: 'phone',
          label: 'phone',
          type: 'text',
      
          required: true,
          placeholder: ' phone',
        },
            {
          name: 'password',
          label: 'password',
          type: 'password',
      
          required: false,
          placeholder: ' password',
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


 initialData={{ role: "company" }} // علشان يبعت type عند الحفظ
      defaultFilters={{ role: "company" }}
            showAddButton={true}
            showEditButton={true}
            showDeleteButton={true}
            showBulkActions={true}
            showDeletedToggle={true}
    />
  );
}
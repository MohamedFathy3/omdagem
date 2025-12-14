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
    router.push(`/merchant/${userId}`);
  };

  return (
      <GenericDataManager
            endpoint="design"
            title="Design"
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
                key: 'price', 
                label: 'price', 
                sortable: true,
               
              },
          
              // {
              //   key: 'actions',
              //   label: 'Actions',
              //   render: (item) => (
              //     <button
              //       onClick={() => handleViewUser(item.id)}
              //       className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      
              //        'bg-gray-700 hover:bg-gray-600 text-white'
              //       }`}
              //     >
              //       <Eye size={16} />
              //       View Details
              //     </button>
              //   )
              // }
            ]}

     formFields={[
        { 
          name: 'name', 
          label: 'name ', 
          type: 'text', 
          required: true,
          placeholder: 'Enter  name'
        },
          { 
          name: 'price', 
          label: 'price', 
          type: 'number', 
          required: false,
          },

   {
             name: "image",
             label: " Image",
             type: "custom",
             component: MediaOrUploadSelector, // ✅ استخدم MediaSelector مباشرة
             useExistingMedia: true, // ✅ أضف هذه الخاصية
             mediaType: "image", // ✅ نوع الوسائط
             required: true,
             allowUpload: true,
           },
        {
             name: "file",
             label: "file Image",
             type: "custom",
             component: MediaOrUploadSelector, // ✅ استخدم MediaSelector مباشرة
             useExistingMedia: true, // ✅ أضف هذه الخاصية
             mediaType: "file", // ✅ نوع الوسائط
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
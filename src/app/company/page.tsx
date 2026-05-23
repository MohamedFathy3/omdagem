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

  

  return (
        <ProtectedRoute allowedRoles={['admin']}>

      <GenericDataManager
            endpoint="training"
            title="training"
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
                label: 'name', 
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
                          {item.name || 'U'}
                        </span>
                      </div>
                    )}
                  
                  </div>
                )
              },
           { 
                key: 'coache_game_settings', 
                label: 'coache_game_settings', 
                sortable: true,
           
              },
               
            { 
                key: 'user_game_settings', 
                label: 'user_game_settings', 
                sortable: true,
           
              },
           
            { 
                key: 'day_training', 
                label: 'day_training', 
                sortable: true,
           
              },
                { 
                key: 'user_game_settings', 
                label: 'user_game_settings', 
                sortable: true,
           
              },
             
            ]}
  additionalData={[
  { 
    key: 'engineer', 
    endpoint: '/user',
  
  },      
]}
     formFields={[
        { 
          name: 'name', 
          label: ' Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter name '
        },
          { 
          name: 'coache_game_settings', 
          label: 'coache_game', 
          type: 'number', 
          required: false,
          
        },
       {
          name: 'day_training',
          label: 'day_training',
          type: 'date',
      
          required: true,
          placeholder: ' day_training',
        },
        
    
        {
          name: 'user_id',
          label: 'trainer',
          type: 'select',
          optionsKey: 'engineer',
          required: true,
          placeholder: 'Select trainer',
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
        {
             name: "video",
             label: "video",
             type: "custom",
             component: MediaOrUploadSelector, // ✅ استخدم MediaSelector مباشرة
             useExistingMedia: true, // ✅ أضف هذه الخاصية
             mediaType: "video", // ✅ نوع الوسائط
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
        </ProtectedRoute>

  );
}
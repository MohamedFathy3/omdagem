// app/products/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { MultiImageUploader } from "@/components/Tablecomponents/MultiImageUploader";
import { Eye, Search, Filter, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function ProductsPage() {
      const router = useRouter();

      const handleViewUser = (userId: number) => {
    router.push(`/seller/${userId}`);
  };

  return (
        <ProtectedRoute allowedRoles={['admin']}>

      <GenericDataManager
            endpoint="seller"
            title="Seller"
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
                      <div className="font-medium">{item.name || 'No Name'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.address}
                      </div><div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.city}
                      </div>
                    </div>
                  </div>
                )
              },
          
            
              { 
                key: 'phone', 
                label: 'Phone', 
                sortable: true,
                render: (item) => item.phone || 'N/A'
              },
              { 
                key: 'nature_of_work', 
                label: 'nature_of_work', 
                sortable: true,
            
              },
             { 
                key: 'workshop_name', 
                label: 'workshop_name', 
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
          name: 'name', 
          label: 'name ', 
          type: 'text', 
          required: true,
          placeholder: 'Enter seller name'
        },
          { 
          name: 'phone', 
          label: 'phone', 
          type: 'text', 
          required: false,
          },



       {
          name: 'password',
          label: 'password',
          type: 'password',
          required: true,
          placeholder: 'password',
        },
   
     
      ]}

 initialData={{ role: 'seller' }} // علشان يبعت type عند الحفظ
      defaultFilters={{ role: 'seller' }}

                showAddButton={false}
      showEditButton={true}
      showDeleteButton={true}
      showBulkActions={true}
      showDeletedToggle={true}
      
    />
        </ProtectedRoute>

  );
}
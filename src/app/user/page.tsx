/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/page.tsx
'use client';
import GenericDataManager from "@/components/Tablecomponents/GenericDataManager";
import { Eye, Play, CheckCircle, AlertCircle, Edit, Lock, Phone, Key } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import toast from "react-hot-toast";
import UpdateCredentialsModal from '@/components/UpdateCredentialsForm';

export default function ProductsPage() {
    const router = useRouter();
    const [activatingUserId, setActivatingUserId] = useState<number | null>(null);
    const [activationMessage, setActivationMessage] = useState<{ userId: number; type: 'success' | 'error'; text: string } | null>(null);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const handleViewUser = (userId: number) => {
        router.push(`/user/${userId}`);
    };

    const handleEditUser = (userId: number) => {
        router.push(`/user/${userId}?edit=true`);
    };

    const handleOpenCredentialsModal = (userId: number) => {
        setSelectedUserId(userId);
        setShowCredentialsModal(true);
    };

    const handleActivateSubscription = async (userId: number) => {
        setActivatingUserId(userId);
        setActivationMessage(null);
        
        try {
            const response = await apiFetch(`subscription/activate/${userId}`, {
                method: 'POST',
            });
            
            if (response.status === 200) {
                setActivationMessage({ 
                    userId, 
                    type: 'success', 
                    text: response.message || 'تم تفعيل الباقة بنجاح' 
                });
                setTimeout(() => {
                    setActivationMessage(null);
                }, 3000);
            } else {
                setActivationMessage({ 
                    userId, 
                    type: 'error', 
                    text: response.message || 'فشل في تفعيل الباقة' 
                });
            }
        } catch (error: any) {
            setActivationMessage({ 
                userId, 
                type: 'error', 
                text: error.message || 'حدث خطأ أثناء التفعيل' 
            });
        } finally {
            setActivatingUserId(null);
        }
    };

    const handleBulkActivate = async (selectedIds: number[]) => {
        let successCount = 0;
        for (const id of selectedIds) {
            try {
                await apiFetch(`subscription/activate/${id}`, { method: 'POST' });
                successCount++;
            } catch (error) {
                console.error(`Failed to activate user ${id}`, error);
            }
        }
        toast.success(`تم تفعيل الباقة لـ ${successCount} من ${selectedIds.length} مستخدم`);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <GenericDataManager
                endpoint="user"
                title="User Management"
                columns={[
                    { 
                        key: 'name', 
                        label: 'Name', 
                        sortable: true,
                        render: (item) => (
                            <div className="flex items-center gap-3">
                                {item.image_url ? (
                                    <img 
                                        src={item.image_url} 
                                        alt={item.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-xs font-medium text-white">
                                            {item.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {item.name || 'No Name'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.email}
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    { 
                        key: 'phone', 
                        label: 'Phone', 
                        sortable: true,
                        render: (item) => (
                            <span className="text-gray-700 dark:text-gray-300">
                                {item.phone || 'N/A'}
                            </span>
                        )
                    },
                    { 
                        key: 'package', 
                        label: 'Package', 
                        sortable: true,
                        render: (item) => (
                            <div>
                                {item.package ? (
                                    <div>
                                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                                            {item.package.title}
                                        </span>
                                        {item.package.selected_price && (
                                            <div className="text-xs text-gray-500">
                                                {item.package.selected_price.months} months - ${item.package.selected_price.price}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-sm">No Package</span>
                                )}
                            </div>
                        )
                    },
                    { 
                        key: 'subscription_status', 
                        label: 'Status', 
                        sortable: true,
                        render: (item) => {
                            const status = item.subscription_status || 'pending';
                            const statusColors: Record<string, string> = {
                                active: 'bg-green-100 text-green-800',
                                expired: 'bg-red-100 text-red-800',
                                pending: 'bg-yellow-100 text-yellow-800'
                            };
                            const statusText: Record<string, string> = {
                                active: 'نشط',
                                expired: 'منتهي',
                                pending: 'قيد الانتظار'
                            };
                            return (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                                    {statusText[status]}
                                </span>
                            );
                        }
                    },
                    { 
                        key: 'subscription_days_left', 
                        label: 'Days Left', 
                        sortable: true,
                        render: (item) => (
                            <span className={`font-medium ${
                                item.subscription_days_left > 0 ? 'text-green-600' : 'text-red-500'
                            }`}>
                                {item.subscription_days_left > 0 ? `${item.subscription_days_left} days` : '-'}
                            </span>
                        )
                    },
                    {
                        key: 'activate_subscription',
                        label: 'Activate',
                        render: (item) => (
                            <div className="space-y-1">
                                <button
                                    onClick={() => handleActivateSubscription(item.id)}
                                    disabled={activatingUserId === item.id || item.subscription_status === 'active'}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                                        activatingUserId === item.id 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : item.subscription_status === 'active'
                                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {activatingUserId === item.id ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Play size={14} />
                                    )}
                                    {activatingUserId === item.id ? 'جاري...' : 'تفعيل'}
                                </button>
                                
                                {activationMessage?.userId === item.id && (
                                    <div className={`flex items-center gap-1 text-xs ${
                                        activationMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {activationMessage.type === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                        <span>{activationMessage.text}</span>
                                    </div>
                                )}
                            </div>
                        )
                    },
                    {
                         key: 'change_credentials',
                        label: 'ChangePassword',
                        render: (item) => (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewUser(item.id)}
                                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                    title="View Details"
                                >
                                    <Eye size={16} />
                                </button>
                            
                                <button
                                    onClick={() => handleOpenCredentialsModal(item.id)}
                                    className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                                    title="Change Phone & Password"
                                >
                                    <Key size={16} />
                                </button>
                            </div>
                        )
                    }
                ]}
                initialData={{ role: 'user', active: true }}
                defaultFilters={{ role: 'user' }}
                showAddButton={true}
                showEditButton={false}
                showDeleteButton={true}
                showBulkActions={true}
                showDeletedToggle={true}
                bulkActions={[
                    {
                        label: 'تفعيل الباقة للمختارين',
                        icon: <Play size={16} />,
                        onClick: async (selectedIds: number[]) => {
                            await handleBulkActivate(selectedIds);
                        }
                    },
                    {
                        label: 'تغيير الباسورد للمختارين',
                        icon: <Lock size={16} />,
                        onClick: async (selectedIds: number[]) => {
                            // هينفذ لكل مستخدم على حدة
                            toast.loading('جاري تغيير الباسورد...');
                            // الكود بتاع تغيير الباسورد للمختارين
                        }
                    }
                ]}
            />
            
            {/* Modal تغيير الباسورد ورقم الهاتف */}
            {showCredentialsModal && selectedUserId && (
                <UpdateCredentialsModal
                    userId={selectedUserId}
                    onClose={() => {
                        setShowCredentialsModal(false);
                        setSelectedUserId(null);
                    }}
                    onSuccess={() => {
                        setShowCredentialsModal(false);
                        setSelectedUserId(null);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    }}
                />
            )}
        </ProtectedRoute>
    );
}
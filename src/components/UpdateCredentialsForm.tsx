/* eslint-disable @typescript-eslint/no-explicit-any */
// components/UpdateCredentialsForm.tsx
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { X, Eye, EyeOff, Phone, Key, Save } from 'lucide-react';

interface UpdateCredentialsProps {
    userId: number;
    onClose: () => void;  // ✅ أضف onClose هنا
    onSuccess?: () => void;
}

export default function UpdateCredentialsForm({ userId, onClose, onSuccess }: UpdateCredentialsProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        password_confirmation: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.phone) {
            toast.error('رقم الهاتف مطلوب');
            return;
        }
        
        if (!formData.password) {
            toast.error('كلمة المرور مطلوبة');
            return;
        }
        
        if (formData.password !== formData.password_confirmation) {
            toast.error('كلمة المرور غير متطابقة');
            return;
        }
        
        if (formData.password.length < 6) {
            toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await apiFetch(`user/update-credentials/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.phone,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                })
            });
            
            if (response.status === 200) {
                toast.success('تم تحديث البيانات بنجاح');
                if (onSuccess) onSuccess();
                onClose(); // ✅ أغلق المودال بعد النجاح
            } else {
                toast.error(response.message || 'فشل في التحديث');
            }
        } catch (error: any) {
            toast.error(error.message || 'حدث خطأ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            تغيير رقم الهاتف والباسورد
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            رقم الهاتف
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                                placeholder="أدخل رقم الهاتف الجديد"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                                placeholder="أدخل كلمة المرور الجديدة"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            تأكيد كلمة المرور
                        </label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                                placeholder="أعد كتابة كلمة المرور"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {loading ? 'جاري التحديث...' : 'تحديث البيانات'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition font-medium"
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
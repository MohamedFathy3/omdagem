/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ActivateSubscriptionButton.tsx
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Play, CheckCircle, AlertCircle } from 'lucide-react';
import { json } from 'stream/consumers';

interface ActivateSubscriptionButtonProps {
    userId: number;
    onSuccess?: () => void;
}

export default function ActivateSubscriptionButton({ userId, onSuccess }: ActivateSubscriptionButtonProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleActivate = async () => {
        setLoading(true);
        setMessage(null);
        
        try {
            const response = await apiFetch(`user/activate-subscription/${userId}`, {
                method: 'POST',
                });
            
            if (response.status === 200) {
                setMessage({ type: 'success', text: response.message });
                if (onSuccess) onSuccess();
            } else {
                setMessage({ type: 'error', text: response.message });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'حدث خطأ أثناء التفعيل' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <button
                onClick={handleActivate}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                } text-white`}
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Play size={16} />
                )}
                {loading ? 'جاري التفعيل...' : 'تفعيل الباقة'}
            </button>
            
            {message && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span className="text-sm">{message.text}</span>
                </div>
            )}
        </div>
    );
}
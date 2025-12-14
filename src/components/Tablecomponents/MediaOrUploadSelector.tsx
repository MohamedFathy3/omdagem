// components/Tablecomponents/MediaOrUploadSelector.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { ImageIcon, Upload, Database, X, Check, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MediaSelector } from './MediaSelector';
import { toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

interface MediaOrUploadSelectorProps {
  value: number | string | File | null;
  onChange: (value: number | string | File | null) => void;
  label?: string;
  required?: boolean;
  endpoint?: string;
  type?: 'image' | 'file' | 'all';
  accept?: string;
}

export const MediaOrUploadSelector: React.FC<MediaOrUploadSelectorProps> = ({
  value,
  onChange,
  label = "Image",
  required = false,
  endpoint = "/media",
  type = "image",
  accept = "image/*"
}) => {
  const [mode, setMode] = useState<'upload' | 'select'>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<number | string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تهيئة القيمة عند التحميل
  useEffect(() => {
    if (value instanceof File) {
      setMode('upload');
      setSelectedFile(value);
      setSelectedMediaId(null);
    } else if (value && (typeof value === 'number' || typeof value === 'string')) {
      setMode('select');
      setSelectedMediaId(value);
      setSelectedFile(null);
    } else {
      setSelectedFile(null);
      setSelectedMediaId(null);
    }
  }, [value]);

const uploadFileToServer = async (file: File): Promise<number | null> => {
  try {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // ✅ استخدم apiFetch بدلاً من fetch مباشرة
    const response = await apiFetch('/media', {
      method: 'POST',
      body: formData,
    });
    
    // ✅ apiFetch يرجع data مباشرة، لا تحتاج response.json()
    console.log('📤 Upload response:', response);
    
    if (response.status === 'success' && response.data && response.data.id) {
      toast.success('Image uploaded successfully!');
      return response.data.id;
    } else {
      toast.error(response.message || 'Failed to upload image');
      return null;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload image');
    return null;
  } finally {
    setUploading(false);
  }
};

  const handleFileChange = async (file: File | null) => {
    if (file) {
      // 🔥 رفع الملف أولاً والحصول على ID
      const mediaId = await uploadFileToServer(file);
      if (mediaId) {
        setSelectedMediaId(mediaId);
        onChange(mediaId); // إرسال ID للـ Backend
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setSelectedMediaId(null);
      onChange(null);
    }
    
    if (!file && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMediaSelect = (mediaId: number | string | null) => {
    setSelectedMediaId(mediaId);
    onChange(mediaId); // إرسال ID للـ Backend
  };

  const handleRemoveFile = () => {
    handleFileChange(null);
  };

  const handleRemoveMedia = () => {
    handleMediaSelect(null);
  };

  // تحديد النوع الحالي
  const getCurrentValueType = () => {
    if (selectedFile) {
      return 'upload';
    } else if (selectedMediaId) {
      return 'select';
    }
    return null;
  };

  const currentType = getCurrentValueType();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* اختيار الوضع */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Method:</span>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setMode('select')}
              className={`
                px-3 py-1 text-xs flex items-center gap-1 transition-colors
                ${mode === 'select' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <Database size={12} />
              Select
            </button>
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`
                px-3 py-1 text-xs flex items-center gap-1 transition-colors
                ${mode === 'upload' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <Upload size={12} />
              Upload
            </button>
          </div>
        </div>
      </div>

      {mode === 'select' ? (
        // وضع اختيار من الوسائط
        <div className="space-y-4">
          <MediaSelector
            value={selectedMediaId}
            onChange={handleMediaSelect}
            label={label}
            required={required}
            endpoint={endpoint}
            type={type}
          />
          
          {selectedMediaId && (
            <div className="flex items-center justify-end mt-2">
              <button
                type="button"
                onClick={handleRemoveMedia}
                className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear Selection
              </button>
            </div>
          )}
          
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1"
            >
              <Upload size={12} />
              Or upload a new image
            </button>
          </div>
        </div>
      ) : (
        // وضع الرفع
        <div className="space-y-4">
          <div className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
            ${selectedFile 
              ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
            }
          `}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              accept={accept}
              className="hidden"
            />
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-32 h-32">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="text-left bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                    <Upload className="text-2xl text-gray-400" />
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Upload {label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click to select or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Supports: {accept || "image/*"}
                  </p>
                </>
              )}
            </div>
          </div>
          
          {selectedFile && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                <Check size={14} />
                New image ready for upload
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            </div>
          )}
          
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode('select')}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1"
            >
              <Database size={12} />
              Or select from existing media
            </button>
          </div>
        </div>
      )}

      {/* عرض معلومات عن التحديد الحالي */}
      {currentType && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
          <div>
            Current selection: 
            <span className={`ml-2 font-medium ${currentType === 'upload' ? 'text-green-600' : 'text-blue-600'}`}>
              {currentType === 'upload' ? 'New Upload' : 'Existing Media'}
            </span>
          </div>
          {currentType === 'upload' && selectedFile && (
            <span className="text-green-600 font-medium">
              ✓ Ready to upload
            </span>
          )}
        </div>
      )}

      {/* رسالة مطلوب */}
      {required && !selectedFile && !selectedMediaId && (
        <p className="text-sm text-red-500">⚠️ {label} is required</p>
      )}
    </div>
  );
};
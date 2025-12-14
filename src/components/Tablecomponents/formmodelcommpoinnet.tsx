// components/Tablecomponents/formmodelcommpoinnet.tsx
'use client';
import React, { useState, useEffect, useRef, useMemo } from "react";
import { SelectField } from "./SelectField";
import { ClassSelector } from "@/components/Tablecomponents/ClassSelector";
import { ImageUploader } from "@/components/Tablecomponents/ImageUpload";
import { MultiImageUploader } from "@/components/Tablecomponents/MultiImageUploader";
import { MediaOrUploadSelector } from "@/components/Tablecomponents/MediaOrUploadSelector";
import { Switch } from "@/components/Tablecomponents/Switch";
import { MediaSelector } from "./MediaSelector";
interface FormFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (val: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalQueries?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData?: any;
  compact?: boolean;
  isEditing?: boolean;
}

export const FormFieldComponent: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  additionalQueries,
  formData = {},
  compact = false,
  isEditing = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  console.log('🔍 FormFieldComponent - field:', field);
  console.log('🔍 FormFieldComponent - value:', value);
  console.log('🔍 FormFieldComponent - isEditing:', isEditing);
  console.log('🔍 FormFieldComponent - field.type:', field.type);

  // ✅ نقل useMemo واحد فقط إلى أعلى المكون
  const normalizedValue = useMemo(() => {
    if (!value) {
      return { existing: [], new: [] };
    }
    
    // إذا كانت قيمة مصفوفة (من gallery قديم)
    if (Array.isArray(value)) {
      return { 
        existing: value.filter(item => typeof item === 'string'), // الصور القديمة
        new: value.filter(item => item instanceof File) // الملفات الجديدة
      };
    }
    
    // إذا كانت قيمة كائن (التنسيق الجديد)
    if (typeof value === 'object' && value !== null) {
      return {
        existing: Array.isArray(value.existing) ? value.existing : [],
        new: Array.isArray(value.new) ? value.new : []
      };
    }
    
    // القيمة الافتراضية
    return { existing: [], new: [] };
  }, [value]);

  console.log('🎯 NORMALIZED VALUE FOR ALL FIELDS:', normalizedValue);

  // ✅ ✅ ✅ الإصلاح الرئيسي: معالجة الـ Switch بشكل منفصل
  if (field.type === "switch") {
    console.log('🎯 SWITCH FIELD DETECTED!', field.name, 'value:', value);
    
    // ✅ تحويل القيمة لـ boolean
   
    const getBooleanValue = (val: unknown): boolean => {
      console.log(`🔄 Converting switch value for ${field.name}:`, val);
      
      if (typeof val === 'boolean') {
        return val;
      }
      if (typeof val === 'string') {
        return val === 'true' || val === '1' || val === 'on';
      }
      if (typeof val === 'number') {
        return val === 1;
      }
      return false;
    };
    
    const switchValue = getBooleanValue(value);
    console.log(`🔘 Switch [${field.name}] boolean value:`, switchValue);
    
    const handleSwitchChange = (newChecked: boolean) => {
      console.log(`🔘 Switch [${field.name}] changed to:`, newChecked);
      
      // ✅ الإصلاح: إرسال القيمة كـ boolean مباشرة
      // لكن نحتاج التأكد من أن الـ onChange يستقبل boolean وليس string
      onChange(newChecked);
    };

    return (
      <div className={`flex items-center justify-between space-x-4 ${compact ? 'col-span-1' : 'col-span-1'} p-3 rounded-lg bg-gray-50 dark:bg-gray-800`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Current: {switchValue ? 'ON ✓' : 'OFF ✗'} 
            <span className="ml-2">({typeof value} = {String(value)})</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={switchValue} 
            onChange={handleSwitchChange} 
            disabled={!isEditing}
          />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {switchValue ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    );
  }
// أضف معالجة MediaOrUploadSelector
 // ✅ معالجة MediaSelector
  if (field.type === "custom" && field.component === MediaSelector) {
    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : 'col-span-1'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <MediaSelector
          value={value}
          onChange={onChange}
          label={field.label}
          required={field.required}
          endpoint={field.props?.endpoint || "/media"}
          type={field.props?.type || "image"}
        />
      </div>
    );
  }

  // ✅ معالجة MediaOrUploadSelector - المكون الجديد
  if (field.type === "custom" && field.component === MediaOrUploadSelector) {
    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : 'col-span-1'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <MediaOrUploadSelector
          value={value}
          onChange={onChange}
          label={field.label}
          required={field.required}
          endpoint={field.props?.endpoint || "/media"}
          type={field.props?.type || "image"}
          accept={field.props?.accept}
        />
      </div>
    );
  }


  // ✅ معالجة حقل التحديد (select)
  if (field.type === "select") {
    return (
      <div className={`space-y-2 ${compact ? 'col-span-1' : 'col-span-1'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <SelectField
          field={field}
          value={value}
          onChange={onChange}
          additionalQueries={additionalQueries}
        />
      </div>
    );
  }

  // ✅ معالجة class-selector
  if (field.type === "custom" && field.component === "class-selector") {
    console.log('🎯 CLASS SELECTOR FIELD TRIGGERED!', field);
    
    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : 'col-span-1'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <ClassSelector
          value={value}
          onChange={onChange}
          additionalQueries={additionalQueries}
          label={field.label}
          required={field.required}
          multiple={field.multiple !== false}
        />
      </div>
    );
  }

  // ✅ معالجة MultiImageUploader - الإصلاح الكامل
  if (field.type === "custom" && field.component === MultiImageUploader) {
    console.log('🎯 MULTI IMAGE UPLOADER FIELD TRIGGERED!', field);
    
    const handleGalleryChange = (newValue: { existing: string[]; new: File[] }) => {
      console.log('🔄 Gallery changed - FULL VALUE:', newValue);
      
      // ✅ الإصلاح: إرسال القيمة الكاملة وليس فقط الملفات الجديدة
      if (isEditing) {
        console.log('✏️ EDIT MODE - Sending full gallery value');
        onChange(newValue); // إرسال الكائن الكامل
      } else {
        console.log('🆕 ADD MODE - Sending full gallery value');
        onChange(newValue); // إرسال الكائن الكامل
      }
    };

    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : 'col-span-1'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <MultiImageUploader
          value={normalizedValue}
          onChange={handleGalleryChange}
          label={field.label}
          required={field.required}
          accept={field.props?.accept || "image/jpeg, image/png, image/jpg, image/gif, image/webp"}
          maxFiles={field.props?.maxFiles || 10}
          compact={compact}
        />
      </div>
    );
  }

  // ✅ معالجة ImageUploader
  if (field.type === "custom" && field.component === ImageUploader) {
    console.log('🎯 IMAGE UPLOADER FIELD TRIGGERED!', field);
    
    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : 'col-span-1'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <ImageUploader
          value={value}
          onChange={onChange}
          label={field.label}
          required={field.required}
          multiple={field.multiple}
          accept={field.props?.accept || "image/png, image/jpg, image/jpeg, image/svg+xml"}
          compact={compact}
          isEditing={isEditing}
        />
      </div>
    );
  }

  // ✅ تحديد إذا كان حقل صورة
  const isImageField = (fieldName: string, fieldType: string): boolean => {
    const imageFieldNames = [
      'logo', 'image', 'avatar', 'photo', 'picture', 
      'profile_image', 'cover_image', 'banner', 'thumbnail'
    ];
    
    return fieldType === 'image' || imageFieldNames.some(name => 
      fieldName.toLowerCase().includes(name)
    );
  };

  // ✅ معالجة حقول الصور
  if (isImageField(field.name, field.type)) {
    console.log('🖼️ Image field detected:', field.name, 'Value:', value);
    
    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : 'col-span-1'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <ImageUploader
          value={value}
          onChange={onChange}
          label={field.label}
          required={field.required}
          multiple={field.multiple}
          accept={field.accept || "image/png, image/jpg, image/jpeg, image/svg+xml"}
          compact={compact}
          isEditing={isEditing}
        />
      </div>
    );
  }

  // ✅ معالجة file input عادي (ليس صورة)
  if (field.type === "file") {
    const handleFileChange = (file: File | null) => {
      onChange(file);
      
      // Reset الـ input إذا كان null
      if (!file && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : 'col-span-1'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <input
          ref={fileInputRef}
          name={field.name}
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;
            handleFileChange(file);
          }}
          required={field.required}
          className="w-full p-3 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          accept={field.accept}
        />
        
        {/* عرض اسم الملف إذا كان موجود */}
        {value && (
          <p className="text-sm text-green-600 dark:text-green-400">
            ✓ Selected: {value.name}
          </p>
        )}
      </div>
    );
  }

  // ✅ معالجة الـ checkbox group
  if (field.type === "custom" && field.component === "checkbox-group") {
    console.log('🎯 CHECKBOX GROUP FIELD TRIGGERED!', field);
    
    const selectedValues = Array.isArray(value) ? value : [];
    type OptionType = { value: string | number; label: string };

    return (
      <div className={`space-y-4 ${compact ? 'col-span-2' : 'col-span-1'}`}>
        <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {field.options?.map((option: OptionType) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <label 
                key={option.value.toString()} 
                className={`
                  relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-105' 
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400 hover:shadow-lg'
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v: string | number) => v !== option.value);
                    onChange(newValues);
                  }}
                  className="sr-only"
                />
                
                <div className={`
                  flex items-center justify-center w-6 h-6 rounded border-2 mr-4 transition-all duration-300
                  ${isSelected 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-700 border-gray-400 group-hover:border-blue-500'
                  }
                `}>
                  {isSelected && (
                    <svg 
                      className="w-3 h-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  )}
                </div>
                
                <span className={`
                  text-base font-medium transition-colors duration-300
                  ${isSelected 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600'
                  }
                `}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
        
        {selectedValues.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
            <i className="fas fa-mouse-pointer text-3xl text-gray-400 mb-3"></i>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Select {field.label.toLowerCase()} by clicking on the options above
            </p>
          </div>
        )}
      </div>
    );
  }

  // ✅ textarea
  if (field.type === "textarea") {
    return (
      <div className={`space-y-2 ${compact ? 'col-span-2' : 'col-span-1'}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          name={field.name}
          value={value?.toString() || ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={field.rows || 4}
          className="w-full p-3 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
          placeholder={field.placeholder}
        />
      </div>
    );
  }

  // ✅ باقي الحقول العادية مع تحسين الباسوورد
  return (
    <div className={`space-y-2 ${compact ? 'col-span-1' : 'col-span-1'}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.label}
        {field.required && !(field.type === 'password' && isEditing) && (
          <span className="text-red-500 ml-1">*</span>
        )}
        {field.type === 'password' && isEditing && (
          <span className="text-xs text-blue-500 ml-1">(Optional)</span>
        )}
      </label>
      
      <input
        name={field.name}
        type={field.type}
        placeholder={
          field.type === 'password' && isEditing 
            ? "Leave empty to keep current password" 
            : field.placeholder || field.label
        }
        // ✅ الإصلاح: إذا القيمة كائن، اعرض string فاضي
        value={
          (value && typeof value === 'object' && !(value instanceof File)) 
            ? "" 
            : value?.toString() || ""
        }
        onChange={(e) => onChange(e.target.value)}
        required={field.required && !(field.type === 'password' && isEditing)}
        className="w-full p-3 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        min={field.type === 'number' ? field.min : undefined}
        max={field.type === 'number' ? field.max : undefined}
        step={field.type === 'number' ? field.step : undefined}
      />
    </div>
  );
};

export default FormFieldComponent;
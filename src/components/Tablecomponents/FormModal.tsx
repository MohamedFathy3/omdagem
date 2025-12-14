// components/Tablecomponents/FormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { FormFieldComponent } from "@/components/Tablecomponents/formmodelcommpoinnet";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editingItem?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formFields?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalQueries?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFormDataChange: (data: any) => void;
  onSave: (options: { keepOpen: boolean }) => void;
  onClose: () => void;
  saveLoading: boolean;
  compactLayout?: boolean;
}

const FormModal: React.FC<FormModalProps> = ({
  title, 
  editingItem, 
  formFields = [],
  formData, 
  additionalQueries,
  onFormDataChange, 
  onSave, 
  onClose, 
  saveLoading,
  compactLayout = false
}) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [localFormData, setLocalFormData] = useState<Record<string, any>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ استخدام formFields آمن
  const safeFormFields = Array.isArray(formFields) ? formFields : [];

  // ✅ التهيئة مرة واحدة فقط عند فتح المودال
  useEffect(() => {
    if (editingItem && !isInitialized) {
      console.log('🎯 INITIALIZING FORM WITH EDITING ITEM:', editingItem);
      
      const processedData = { ...editingItem };
      
      // ✅ معالجة الحقول الخاصة بشكل صحيح
      safeFormFields.forEach(field => {
        if (!field || !field.name) return;
        
        // 🔥 تجاهل كلمة المرور عند التعديل
        if (field.type === 'password' && editingItem.id) {
          processedData[field.name] = '';
          return;
        }
          if (editingItem.brand_id) {
            processedData.brand_id = editingItem.brand_id;
          } else if (editingItem.brand && editingItem.brand.id) {
            processedData.brand_id = editingItem.brand.id;
          } else if (editingItem.brand && typeof editingItem.brand === 'number') {
            processedData.brand_id = editingItem.brand;
          } else if (editingItem.brand && typeof editingItem.brand === 'string') {
            const brands = additionalQueries?.Brand?.data || [];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const foundBrand = brands.find((b: any) => 
              b.name === editingItem.brand || b.id.toString() === editingItem.brand
            );
            if (foundBrand) {
              processedData.brand_id = foundBrand.id;
            }
          }

    // ✅ إصلاح مشكلة الـ category_id
        if (field.name === 'engineer_id') {
          console.log('🔍 CATEGORY FIELD DEBUG:', {
            category_id: editingItem.engineer_id,
            category: editingItem.engineer,
            field: field
          });
          
          // الحالة 1: إذا كان category_id موجود مباشرة
          if (editingItem.engineer_id) {
            processedData.engineer_id = editingItem.engineer_id;
          } 
          
          // الحالة 2: إذا كان category كائن به id
          else if (editingItem.engineer && editingItem.engineer.id) {
            processedData.engineer_id = editingItem.engineer.id;
          }
          // الحالة 3: إذا كان category قيمة مباشرة (رقم)
          else if (editingItem.engineer && typeof editingItem.engineer === 'number') {
            processedData.engineer_id = editingItem.engineer;
          }
          // الحالة 4: إذا كان category نص (تحويل من الاسم)
          else if (editingItem.engineer && typeof editingItem.engineer === 'string') {
            // البحث في additionalQueries عن الـ category المناسب
            const categories = additionalQueries?.categories?.data || [];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const foundCategory = categories.find((cat: any) => 
              cat.name === editingItem.engineer || cat.id.toString() === editingItem.engineer
            );
            if (foundCategory) {
              processedData.engineer_id = foundCategory.id;
            }
          }
          
          console.log('✅ FINAL CATEGORY ID:', processedData.engineer_id);
        }
        
          
        // ✅ إصلاح مشكلة الـ category_id
        if (field.name === 'category_id') {
          console.log('🔍 CATEGORY FIELD DEBUG:', {
            category_id: editingItem.category_id,
            category: editingItem.category,
            field: field
          });
          
          // الحالة 1: إذا كان category_id موجود مباشرة
          if (editingItem.category_id) {
            processedData.category_id = editingItem.category_id;
          } 
          
          // الحالة 2: إذا كان category كائن به id
          else if (editingItem.category && editingItem.category.id) {
            processedData.category_id = editingItem.category.id;
          }
          // الحالة 3: إذا كان category قيمة مباشرة (رقم)
          else if (editingItem.category && typeof editingItem.category === 'number') {
            processedData.category_id = editingItem.category;
          }
          // الحالة 4: إذا كان category نص (تحويل من الاسم)
          else if (editingItem.category && typeof editingItem.category === 'string') {
            // البحث في additionalQueries عن الـ category المناسب
            const categories = additionalQueries?.categories?.data || [];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const foundCategory = categories.find((cat: any) => 
              cat.name === editingItem.category || cat.id.toString() === editingItem.category
            );
            if (foundCategory) {
              processedData.category_id = foundCategory.id;
            }
          }
          
          console.log('✅ FINAL CATEGORY ID:', processedData.category_id);
        }
        
        // ✅ معالجة gallery بشكل صحيح - الباك يرسلها كمصفوفة URLs
        if (field.name === 'gallery') {
          if (Array.isArray(editingItem.gallery)) {
            processedData.gallery = { 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              existing: editingItem.gallery.filter((img: any) => typeof img === 'string'), 
              new: [] 
            };
          } else {
            // ✅ قيمة افتراضية
            processedData.gallery = { existing: [], new: [] };
          }
          console.log('✅ PROCESSED GALLERY FOR UPLOADER:', processedData.gallery);
        }
      });
      
      console.log('🎯 FINAL PROCESSED FORM DATA:', processedData);
      setLocalFormData(processedData);
      setIsInitialized(true);
      onFormDataChange(processedData);
    } else if (!editingItem && !isInitialized) {
      // ✅ تهيئة نموذج جديد
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialData: Record<string, any> = {};
      
      // تعيين القيم الافتراضية
      safeFormFields.forEach(field => {
        if (!field || !field.name) return;
        
        if (field.name === 'gallery') {
          initialData[field.name] = { existing: [], new: [] }; // ✅ الهيكل الصحيح للـ uploader
        } else if (field.defaultValue !== undefined) {
          initialData[field.name] = field.defaultValue;
        } else if (field.type === 'select' && field.options && field.options.length > 0) {
          initialData[field.name] = field.options[0].value;
        } else if (field.type === 'switch') {
          initialData[field.name] = false;
        } else {
          initialData[field.name] = '';
        }
      });
      
      setLocalFormData(initialData);
      setIsInitialized(true);
      onFormDataChange(initialData);
    }
  }, [editingItem, safeFormFields, isInitialized, onFormDataChange, additionalQueries]);

  // ✅ تحديث formData الرئيسي عند تغيير localFormData
  useEffect(() => {
    if (isInitialized && Object.keys(localFormData).length > 0) {
      console.log('🔄 UPDATING FORM DATA:', localFormData);
      onFormDataChange(localFormData);
    }
  }, [localFormData, onFormDataChange, isInitialized]);

  // ✅ تقسيم الحقول ديناميكي للتابات - إصلاح التكرار
  const getTabsData = () => {
    if (!Array.isArray(safeFormFields) || safeFormFields.length === 0) {
      return [];
    }

    // ✅ إصلاح: منع تكرار الحقول بين التابات
    const usedFields = new Set();
    
    const basicFields = safeFormFields.filter(field => 
      field && 
      !usedFields.has(field.name) && 
      ['text', 'email', 'password', 'tel', 'url', 'number', 'switch'].includes(field.type)
    );
    basicFields.forEach(field => usedFields.add(field.name));
    
    const selectionFields = safeFormFields.filter(field => 
      field && 
      !usedFields.has(field.name) && 
      ['select'].includes(field.type)
    );
    selectionFields.forEach(field => usedFields.add(field.name));
    
    const customFields = safeFormFields.filter(field => 
      field && 
      !usedFields.has(field.name) && 
      field.type === 'custom' && 
      field.component?.name !== 'MultiImageUploader'
    );
    customFields.forEach(field => usedFields.add(field.name));
    
    const mediaFields = safeFormFields.filter(field => 
      field && 
      !usedFields.has(field.name) && 
      (
        ['image', 'file'].includes(field.type) || 
        (field.type === 'custom' && field.component?.name === 'MultiImageUploader')
      )
    );
    mediaFields.forEach(field => usedFields.add(field.name));
    
    const advancedFields = safeFormFields.filter(field => 
      field && 
      !usedFields.has(field.name) && 
      ['textarea', 'date', 'datetime-local', 'time', 'checkbox'].includes(field.type)
    );

    const tabs = [
      { id: 'basic', label: '📝 Basic', fields: basicFields, icon: 'fa-file-alt' },
      { id: 'selection', label: '📋 Selection', fields: selectionFields, icon: 'fa-list' },
      { id: 'custom', label: '⚙️ Custom', fields: customFields, icon: 'fa-cog' },
      { id: 'media', label: '🖼️ Media', fields: mediaFields, icon: 'fa-image' },
      { id: 'advanced', label: '🔧 Advanced', fields: advancedFields, icon: 'fa-tools' },
    ];

    // ✅ إرجاع التابات التي تحتوي على حقول فقط
    return tabs.filter(tab => tab.fields && tab.fields.length > 0);
  };

  const tabs = getTabsData();
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0] || { id: 'basic', fields: [] };
  const modalSize = 'w-full max-w-5xl';

  // ✅ إصلاح: إزالة معالجة gallery الخاصة
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLocalFormDataChange = (fieldName: string, value: any) => {
    console.log(`🔄 FIELD ${fieldName} CHANGED TO:`, value);
    
    setLocalFormData(prev => {
      const newData = { ...prev, [fieldName]: value };
      console.log('🔄 UPDATED LOCAL FORM DATA:', newData);
      return newData;
    });
  };

  // ✅ إعادة تعيين عند إغلاق المودال
  const handleClose = () => {
    setLocalFormData({});
    setIsInitialized(false);
    onClose();
  };

  const handleSaveClick = (options: { keepOpen: boolean }) => {
    console.log('💾 SAVING FORM DATA:', localFormData);
    
    // ❌ إزالة معالجة gallery - سيتم معالجتها في useGenericDataManager
    onSave(options);
  };

  // 🔥 عرض رسالة إذا لم توجد حقول
  if (!Array.isArray(safeFormFields) || safeFormFields.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold z-10"
          >
            ✖
          </button>
          
          <div className="text-center py-8">
            <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Form Fields Defined
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              No form fields are available for {title}. Please check the configuration.
            </p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              style={{background:"#fee4e4",color:'black'}}
              className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gray-200 transition-all rounded-xl border-none py-3 px-6 text-base font-medium"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl ${modalSize} p-6 relative max-h-[90vh] overflow-hidden`}>
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold z-10"
        >
          ✖
        </button>
        
        {/* الهيدر */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {editingItem ? `Edit ${title}` : `Add ${title}`}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {editingItem ? 'Update the item details' : 'Fill in the details below'}
          </p>
          {/* 🔥 إضافة ملاحظة للباسوورد */}
          {editingItem && safeFormFields.some(f => f && f.type === 'password') && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              💡 Leave password field empty to keep current password
            </p>
          )}
        </div>

        {/* ✅ التابات */}
        {tabs.length > 0 ? (
          <>
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex-1 text-center justify-center
                      ${activeTab === tab.id 
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                      }
                    `}
                  >
                    <i className={`fas ${tab.icon} text-xs`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              handleSaveClick({ keepOpen: false });
            }}>
              <div className="min-h-[400px] max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                <div className={`grid gap-6 ${compactLayout ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {currentTab?.fields?.map((field) => (
                    field && (
                      <FormFieldComponent
                        key={field.name}
                        field={field}
                        value={localFormData[field.name]}
                        onChange={(value: unknown) => handleLocalFormDataChange(field.name, value)}
                        additionalQueries={additionalQueries}
                        formData={localFormData}
                        compact={compactLayout}
                        isEditing={!!editingItem}
                      />
                    )
                  ))}
                </div>

                {(!currentTab?.fields || currentTab.fields.length === 0) && (
                  <div className="text-center py-16">
                    <i className="fas fa-inbox text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No fields in this section
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                      Switch to another tab to see available fields
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  style={{color:'black'}}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-50 to-green-100 text-black hover:bg-green-200 transition-all rounded-xl py-3 text-base font-medium"
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving..." : editingItem ? "Update" : "Create"}
                </Button>

                <Button
                  style={{color:'black'}}
                  type="button"
                  className="flex-1 bg-gradient-to-r from-green-50 to-green-100 text-black hover:bg-green-200 transition-all rounded-xl py-3 text-base font-medium"
                  disabled={saveLoading}
                  onClick={() => {
                    handleSaveClick({ keepOpen: true });
                  }}
                >
                  {saveLoading ? "Saving..." : editingItem ? "Update & New" : "Create & New"}
                </Button>

                <Button
                  type="button"
                  style={{background:"#fee4e4",color:'black'}}
                  className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gray-200 transition-all rounded-xl border-none py-3 text-base font-medium"
                  onClick={handleClose}
                  disabled={saveLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-16">
            <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Form Tabs Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no form fields configured for {title}.
            </p>
            <div className="flex justify-center pt-6">
              <Button
                type="button"
                style={{background:"#fee4e4",color:'black'}}
                className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:bg-gray-200 transition-all rounded-xl border-none py-3 px-6 text-base font-medium"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormModal;
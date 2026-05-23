/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import {TextStyle} from '@tiptap/extension-text-style';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/MainLayout';

interface Price {
  months: number;
  price: number;
}

interface Package {
  id: number;
  title: string;
  description: string;
  prices: Price[];
  active: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// شريط أدوات المحرر
const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
          editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
          editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
          editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Strike"
      >
        <s>S</s>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
          editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
          editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`}
        title="Numbered List"
      >
        1. List
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
      <select
        onChange={(e) => editor.chain().focus().setHeading({ level: parseInt(e.target.value) as any }).run()}
        className="p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        title="Heading"
      >
        <option value="">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
      <select
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        title="Text Color"
      >
        <option value="">Color</option>
        <option value="#000000">Black</option>
        <option value="#e74c3c">Red</option>
        <option value="#2ecc71">Green</option>
        <option value="#3498db">Blue</option>
        <option value="#f39c12">Orange</option>
        <option value="#9b59b6">Purple</option>
      </select>
      <button
        onClick={() => editor.chain().focus().unsetColor().run()}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        title="Reset Color"
      >
        Reset
      </button>
    </div>
  );
};

export default function PackageManager() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prices: [{ months: 1, price: 0 }] as Price[],
    active: true
  });

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: formData.description,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, description: editor.getHTML() });
    },
  });

  // تحديث المحتوى عند تغيير formData.description من الخارج
  useEffect(() => {
    if (editor && formData.description !== editor.getHTML()) {
      editor.commands.setContent(formData.description);
    }
  }, [editor, formData.description]);

  const fetchPackages = async (showDeletedItems = false) => {
    try {
      setLoading(true);
      const payload: any = {
        filters: {},
        orderBy: 'id',
        orderByDirection: 'desc',
        perPage: 100,
        paginate: true
      };
      
      if (showDeletedItems) {
        payload.filters.deleted = 'true';
      }
      
      const response = await apiFetch('/package/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setPackages(response.data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(showDeleted);
  }, [showDeleted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (formData.prices.length === 0) {
      toast.error('At least one price is required');
      return;
    }
    
    const invalidPrice = formData.prices.some(p => p.months <= 0 || p.price <= 0);
    if (invalidPrice) {
      toast.error('Months and price must be greater than 0');
      return;
    }

    try {
      if (editingPackage) {
        await apiFetch(`/package/${editingPackage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        toast.success('Package updated successfully!');
      } else {
        await apiFetch('/package', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        toast.success('Package created successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchPackages(showDeleted);
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error(editingPackage ? 'Failed to update' : 'Failed to create');
    }
  };

  const handleDelete = async (pkg: Package) => {
    if (!confirm(`Are you sure you want to delete "${pkg.title}"?`)) return;
    
    try {
      await apiFetch('/package/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [pkg.id] })
      });
      toast.success('Package deleted successfully!');
      fetchPackages(showDeleted);
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete');
    }
  };

  const handleRestore = async (pkg: Package) => {
    if (!confirm(`Are you sure you want to restore "${pkg.title}"?`)) return;
    
    try {
      await apiFetch('/package/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [pkg.id] })
      });
      toast.success('Package restored successfully!');
      fetchPackages(showDeleted);
    } catch (error) {
      console.error('Error restoring package:', error);
      toast.error('Failed to restore');
    }
  };

  const handleForceDelete = async (pkg: Package) => {
    if (!confirm(`⚠️ PERMANENT DELETE!\n\nAre you sure you want to permanently delete "${pkg.title}"?\nThis action CANNOT be undone!`)) return;
    
    try {
      await apiFetch('/package/force-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [pkg.id] })
      });
      toast.success('Package permanently deleted!');
      fetchPackages(showDeleted);
    } catch (error) {
      console.error('Error force deleting package:', error);
      toast.error('Failed to permanently delete');
    }
  };

  const handleToggleActive = async (pkg: Package) => {
    try {
      await apiFetch(`/package/${pkg.id}/active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !pkg.active })
      });
      toast.success(`${pkg.active ? 'Deactivated' : 'Activated'} successfully!`);
      fetchPackages(showDeleted);
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      prices: pkg.prices || [{ months: 1, price: 0 }],
      active: pkg.active
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setFormData({
      title: '',
      description: '',
      prices: [{ months: 1, price: 0 }],
      active: true
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      title: '',
      description: '',
      prices: [{ months: 1, price: 0 }],
      active: true
    });
  };

  const addPrice = () => {
    setFormData({
      ...formData,
      prices: [...formData.prices, { months: 1, price: 0 }]
    });
  };

  const updatePrice = (index: number, field: keyof Price, value: number) => {
    const updatedPrices = [...formData.prices];
    updatedPrices[index][field] = value;
    setFormData({ ...formData, prices: updatedPrices });
  };

  const removePrice = (index: number) => {
    const updatedPrices = formData.prices.filter((_, i) => i !== index);
    setFormData({ ...formData, prices: updatedPrices });
  };

  const renderDescription = (description: string) => {
    return { __html: description };
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Packages</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your subscription packages
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                showDeleted 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {showDeleted ? 'Show Active' : 'Show Deleted'}
            </button>
            
            {!showDeleted && (
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Package
              </button>
            )}
          </div>
        </div>

        {/* Table - نفس الكود مع تعديل عرض الـ description */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-2 text-gray-500">
              {showDeleted ? 'No deleted packages found' : 'No packages found'}
            </p>
            {!showDeleted && (
              <button
                onClick={handleAdd}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Create your first package →
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prices</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition ${pkg.deleted_at ? 'opacity-60 bg-red-50 dark:bg-red-900/10' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">#{pkg.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {pkg.title}
                        {pkg.deleted_at && (
                          <span className="ml-2 text-xs text-red-600 dark:text-red-400">(Deleted)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none line-clamp-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_p]:my-1"
                          dangerouslySetInnerHTML={renderDescription(pkg.description)}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          {pkg.prices?.map((price, idx) => (
                            <div key={idx} className="text-gray-600 dark:text-gray-300">
                              📅 {price.months} month{price.months > 1 ? 's' : ''}: 💰 {price.price} EGP
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!pkg.deleted_at && (
                          <button
                            onClick={() => handleToggleActive(pkg)}
                            className={`px-2 py-1 rounded-full text-xs font-semibold transition ${
                              pkg.active 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {pkg.active ? 'Active' : 'Inactive'}
                          </button>
                        )}
                        {pkg.deleted_at && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Deleted
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {!pkg.deleted_at ? (
                            <>
                              <button
                                onClick={() => handleEdit(pkg)}
                                className="text-blue-600 hover:text-blue-800 transition px-2 py-1 rounded"
                                title="Edit"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDelete(pkg)}
                                className="text-red-600 hover:text-red-800 transition px-2 py-1 rounded"
                                title="Soft Delete"
                              >
                                🗑️ Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(pkg)}
                                className="text-green-600 hover:text-green-800 transition px-2 py-1 rounded"
                                title="Restore"
                              >
                                ↩️ Restore
                              </button>
                              <button
                                onClick={() => handleForceDelete(pkg)}
                                className="text-red-700 hover:text-red-900 transition px-2 py-1 rounded"
                                title="Permanent Delete"
                              >
                                💀 Force Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {modalOpen && !showDeleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingPackage ? 'Edit Package' : 'Add New Package'}
                  </h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-2xl"
                  >
                    ✖
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter package title"
                      required
                    />
                  </div>

                  {/* Description - TipTap Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <MenuBar editor={editor} />
                      <EditorContent 
                        editor={editor} 
                        className="min-h-[200px] px-4 py-2 bg-white dark:bg-gray-800 prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      You can format text: bold, italic, lists, colors, and more!
                    </p>
                  </div>

                  {/* Prices */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price Plans <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {formData.prices.map((price, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={price.months}
                            onChange={(e) => updatePrice(idx, 'months', parseInt(e.target.value) || 0)}
                            placeholder="Months"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                            min="1"
                            required
                          />
                          <input
                            type="number"
                            value={price.price}
                            onChange={(e) => updatePrice(idx, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="Price"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                            min="0"
                            step="0.01"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removePrice(idx)}
                            className="text-red-600 hover:text-red-800 px-3 py-2 rounded transition"
                            title="Remove price"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addPrice}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Price Plan
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, active: !formData.active })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        formData.active ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          formData.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                    >
                      {editingPackage ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
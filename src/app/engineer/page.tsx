/* eslint-disable @typescript-eslint/no-explicit-any */
// app/results/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/MainLayout';
import type { ResultData, User } from '@/types/result';

export default function ResultsManager() {
  const [results, setResults] = useState<ResultData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ResultData | null>(null);
  const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    user_id: '',
    before_title: '',
    before_description: '',
    before_weight: '',
    before_muscle_mass: '',
    before_fat_percentage: '',
    before_image: null as File | null,
    after_title: '',
    after_description: '',
    after_weight: '',
    after_muscle_mass: '',
    after_fat_percentage: '',
    after_image: null as File | null,
  });
  
  const [previews, setPreviews] = useState({
    before: null as string | null,
    after: null as string | null,
  });

  // جلب المستخدمين
  const fetchUsers = async () => {
    try {
      const response = await apiFetch('/user/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: {},
          orderBy: 'id',
          orderByDirection: 'desc',
          perPage: 100,
          paginate: true
        })
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // جلب النتائج
  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/result/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: {},
          orderBy: 'id',
          orderByDirection: 'desc',
          perPage: 100,
          paginate: true
        })
      });
      setResults(response.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchResults();
  }, []);

  // إضافة أو تعديل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_id) {
      toast.error('Please select a student');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', formData.user_id);
      
      if (formData.before_title) formDataToSend.append('before_title', formData.before_title);
      if (formData.before_description) formDataToSend.append('before_description', formData.before_description);
      if (formData.before_weight) formDataToSend.append('before_weight', formData.before_weight);
      if (formData.before_muscle_mass) formDataToSend.append('before_muscle_mass', formData.before_muscle_mass);
      if (formData.before_fat_percentage) formDataToSend.append('before_fat_percentage', formData.before_fat_percentage);
      if (formData.before_image) formDataToSend.append('before_image', formData.before_image);
      
      if (formData.after_title) formDataToSend.append('after_title', formData.after_title);
      if (formData.after_description) formDataToSend.append('after_description', formData.after_description);
      if (formData.after_weight) formDataToSend.append('after_weight', formData.after_weight);
      if (formData.after_muscle_mass) formDataToSend.append('after_muscle_mass', formData.after_muscle_mass);
      if (formData.after_fat_percentage) formDataToSend.append('after_fat_percentage', formData.after_fat_percentage);
      if (formData.after_image) formDataToSend.append('after_image', formData.after_image);

      if (editingResult) {
        await apiFetch(`/result/${editingResult.id}`, {
          method: 'POST',
          body: formDataToSend
        });
        toast.success('Result updated successfully!');
      } else {
        await apiFetch('/result', {
          method: 'POST',
          body: formDataToSend
        });
        toast.success('Result created successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchResults();
    } catch (error: any) {
      console.error('Error saving result:', error);
      if (error.errors) {
        Object.values(error.errors).forEach((err: any) => toast.error(err[0]));
      } else {
        toast.error(editingResult ? 'Failed to update' : 'Failed to create');
      }
    }
  };

  // حذف
  const handleDelete = async (result: ResultData) => {
    if (!confirm(`Are you sure you want to delete results for ${result.user_name}?`)) return;
    
    try {
      await apiFetch(`/result/${result.id}`, {
        method: 'DELETE',
      });
      toast.success('Result deleted successfully!');
      fetchResults();
    } catch (error) {
      console.error('Error deleting result:', error);
      toast.error('Failed to delete');
    }
  };

  // فتح مودال التعديل
  const handleEdit = (result: ResultData) => {
    setEditingResult(result);
    setFormData({
      user_id: result.user_id.toString(),
      before_title: result.before.title || '',
      before_description: result.before.description || '',
      before_weight: result.before.weight?.toString() || '',
      before_muscle_mass: result.before.muscle_mass?.toString() || '',
      before_fat_percentage: result.before.fat_percentage?.toString() || '',
      before_image: null,
      after_title: result.after.title || '',
      after_description: result.after.description || '',
      after_weight: result.after.weight?.toString() || '',
      after_muscle_mass: result.after.muscle_mass?.toString() || '',
      after_fat_percentage: result.after.fat_percentage?.toString() || '',
      after_image: null,
    });
    setPreviews({
      before: result.before.image_url,
      after: result.after.image_url,
    });
    setModalOpen(true);
  };

  // فتح مودال العرض
  const handleView = (result: ResultData) => {
    setSelectedResult(result);
    setViewModalOpen(true);
  };

  // فتح مودال الإضافة
  const handleAdd = () => {
    setEditingResult(null);
    setFormData({
      user_id: '',
      before_title: '',
      before_description: '',
      before_weight: '',
      before_muscle_mass: '',
      before_fat_percentage: '',
      before_image: null,
      after_title: '',
      after_description: '',
      after_weight: '',
      after_muscle_mass: '',
      after_fat_percentage: '',
      after_image: null,
    });
    setPreviews({ before: null, after: null });
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditingResult(null);
    setFormData({
      user_id: '',
      before_title: '',
      before_description: '',
      before_weight: '',
      before_muscle_mass: '',
      before_fat_percentage: '',
      before_image: null,
      after_title: '',
      after_description: '',
      after_weight: '',
      after_muscle_mass: '',
      after_fat_percentage: '',
      after_image: null,
    });
    setPreviews({ before: null, after: null });
  };

  const handleImageChange = (type: 'before' | 'after', file: File | null) => {
    if (file) {
      setFormData({ ...formData, [`${type}_image`]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'loss': return 'text-green-600';
      case 'gain': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getProgressIcon = (status: string) => {
    switch (status) {
      case 'loss': return '▼';
      case 'gain': return '▲';
      default: return '●';
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Results</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage before and after results for students
            </p>
          </div>
          
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Results
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-gray-500">No results found</p>
            <button
              onClick={handleAdd}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Add your first result →
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Before</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">After</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{result.user_name}</div>
                        <div className="text-sm text-gray-500">{result.user_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {result.before.image_url ? (
                            <img src={result.before.image_url} alt="Before" className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="text-sm">
                            {result.before.weight && <div>⚖️ {result.before.weight} kg</div>}
                            {result.before.muscle_mass && <div>💪 {result.before.muscle_mass} kg</div>}
                            {result.before.fat_percentage && <div>🔥 {result.before.fat_percentage}%</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {result.after.image_url ? (
                            <img src={result.after.image_url} alt="After" className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          <div className="text-sm">
                            {result.after.weight && <div>⚖️ {result.after.weight} kg</div>}
                            {result.after.muscle_mass && <div>💪 {result.after.muscle_mass} kg</div>}
                            {result.after.fat_percentage && <div>🔥 {result.after.fat_percentage}%</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          {result.progress.weight && (
                            <div className={getProgressColor(result.progress.weight.status)}>
                              {getProgressIcon(result.progress.weight.status)} Weight: {Math.abs(result.progress.weight.change)} kg ({Math.abs(result.progress.weight.percentage)}%)
                            </div>
                          )}
                          {result.progress.muscle_mass && (
                            <div className={getProgressColor(result.progress.muscle_mass.status)}>
                              {getProgressIcon(result.progress.muscle_mass.status)} Muscle: +{result.progress.muscle_mass.change} kg
                            </div>
                          )}
                          {result.progress.fat_percentage && (
                            <div className={getProgressColor(result.progress.fat_percentage.status)}>
                              {getProgressIcon(result.progress.fat_percentage.status)} Fat: {Math.abs(result.progress.fat_percentage.change)}%
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleView(result)}
                            className="text-blue-600 hover:text-blue-800 transition px-2 py-1 rounded"
                            title="View"
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => handleEdit(result)}
                            className="text-yellow-600 hover:text-yellow-800 transition px-2 py-1 rounded"
                            title="Edit"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(result)}
                            className="text-red-600 hover:text-red-800 transition px-2 py-1 rounded"
                            title="Delete"
                          >
                            🗑️ Delete
                          </button>
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
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingResult ? 'Edit Results' : 'Add Results for Student'}
                  </h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-2xl"
                  >
                    ✖
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Select Student */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!!editingResult}
                    >
                      <option value="">Select a student</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name} - {user.email}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Before Section */}
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-yellow-600 mb-4">📸 Before</h3>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Title"
                          value={formData.before_title}
                          onChange={(e) => setFormData({ ...formData, before_title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800"
                        />
                        
                        <textarea
                          placeholder="Description"
                          rows={2}
                          value={formData.before_description}
                          onChange={(e) => setFormData({ ...formData, before_description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800"
                        />
                        
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Weight (kg)"
                            value={formData.before_weight}
                            onChange={(e) => setFormData({ ...formData, before_weight: e.target.value })}
                            className="w-full px-2 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 text-sm"
                          />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Muscle (kg)"
                            value={formData.before_muscle_mass}
                            onChange={(e) => setFormData({ ...formData, before_muscle_mass: e.target.value })}
                            className="w-full px-2 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 text-sm"
                          />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Fat %"
                            value={formData.before_fat_percentage}
                            onChange={(e) => setFormData({ ...formData, before_fat_percentage: e.target.value })}
                            className="w-full px-2 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 text-sm"
                          />
                        </div>
                        
                        {previews.before && (
                          <img src={previews.before} alt="Before preview" className="w-32 h-32 object-cover rounded-lg" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange('before', e.target.files?.[0] || null)}
                          className="w-full text-sm"
                        />
                      </div>
                    </div>

                    {/* After Section */}
                    <div className="border rounded-lg p-4 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-green-600 mb-4">🎯 After</h3>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Title"
                          value={formData.after_title}
                          onChange={(e) => setFormData({ ...formData, after_title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800"
                        />
                        
                        <textarea
                          placeholder="Description"
                          rows={2}
                          value={formData.after_description}
                          onChange={(e) => setFormData({ ...formData, after_description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800"
                        />
                        
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Weight (kg)"
                            value={formData.after_weight}
                            onChange={(e) => setFormData({ ...formData, after_weight: e.target.value })}
                            className="w-full px-2 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 text-sm"
                          />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Muscle (kg)"
                            value={formData.after_muscle_mass}
                            onChange={(e) => setFormData({ ...formData, after_muscle_mass: e.target.value })}
                            className="w-full px-2 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 text-sm"
                          />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Fat %"
                            value={formData.after_fat_percentage}
                            onChange={(e) => setFormData({ ...formData, after_fat_percentage: e.target.value })}
                            className="w-full px-2 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 text-sm"
                          />
                        </div>
                        
                        {previews.after && (
                          <img src={previews.after} alt="After preview" className="w-32 h-32 object-cover rounded-lg" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange('after', e.target.files?.[0] || null)}
                          className="w-full text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                    >
                      {editingResult ? 'Update' : 'Create'}
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

        {/* View Modal */}
        {viewModalOpen && selectedResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Results: {selectedResult.user_name}
                  </h2>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-2xl"
                  >
                    ✖
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-yellow-600 mb-4">📸 Before</h3>
                    {selectedResult.before.image_url && (
                      <img src={selectedResult.before.image_url} alt="Before" className="w-full rounded-lg mb-4" />
                    )}
                    <div className="space-y-2">
                      <p><strong>Title:</strong> {selectedResult.before.title || '-'}</p>
                      <p><strong>Description:</strong> {selectedResult.before.description || '-'}</p>
                      <p><strong>Weight:</strong> {selectedResult.before.weight || '-'} kg</p>
                      <p><strong>Muscle Mass:</strong> {selectedResult.before.muscle_mass || '-'} kg</p>
                      <p><strong>Body Fat:</strong> {selectedResult.before.fat_percentage || '-'}%</p>
                    </div>
                  </div>

                  {/* After */}
                  <div className="border rounded-lg p-4 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-green-600 mb-4">🎯 After</h3>
                    {selectedResult.after.image_url && (
                      <img src={selectedResult.after.image_url} alt="After" className="w-full rounded-lg mb-4" />
                    )}
                    <div className="space-y-2">
                      <p><strong>Title:</strong> {selectedResult.after.title || '-'}</p>
                      <p><strong>Description:</strong> {selectedResult.after.description || '-'}</p>
                      <p><strong>Weight:</strong> {selectedResult.after.weight || '-'} kg</p>
                      <p><strong>Muscle Mass:</strong> {selectedResult.after.muscle_mass || '-'} kg</p>
                      <p><strong>Body Fat:</strong> {selectedResult.after.fat_percentage || '-'}%</p>
                    </div>
                  </div>
                </div>

                {/* Progress Summary */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-center mb-4">📊 Progress Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedResult.progress.weight && (
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="text-lg font-bold">
                          {selectedResult.progress.weight.before} kg → {selectedResult.progress.weight.after} kg
                        </p>
                        <p className={`font-semibold ${getProgressColor(selectedResult.progress.weight.status)}`}>
                          {getProgressIcon(selectedResult.progress.weight.status)} {Math.abs(selectedResult.progress.weight.change)} kg ({Math.abs(selectedResult.progress.weight.percentage)}%)
                        </p>
                      </div>
                    )}
                    {selectedResult.progress.muscle_mass && (
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Muscle Mass</p>
                        <p className="text-lg font-bold">
                          {selectedResult.progress.muscle_mass.before} kg → {selectedResult.progress.muscle_mass.after} kg
                        </p>
                        <p className={`font-semibold ${getProgressColor(selectedResult.progress.muscle_mass.status)}`}>
                          {getProgressIcon(selectedResult.progress.muscle_mass.status)} +{selectedResult.progress.muscle_mass.change} kg
                        </p>
                      </div>
                    )}
                    {selectedResult.progress.fat_percentage && (
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Body Fat</p>
                        <p className="text-lg font-bold">
                          {selectedResult.progress.fat_percentage.before}% → {selectedResult.progress.fat_percentage.after}%
                        </p>
                        <p className={`font-semibold ${getProgressColor(selectedResult.progress.fat_percentage.status)}`}>
                          {getProgressIcon(selectedResult.progress.fat_percentage.status)} {Math.abs(selectedResult.progress.fat_percentage.change)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/exercise/ExerciseManager.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/MainLayout';

interface Exercise {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  youtube_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function ExerciseManager() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ منع التكرار
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    youtube_url: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // جلب التمارين
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/exercise/index', {
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
      
      setExercises(response.data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // إضافة أو تعديل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ منع التكرار
    if (isSubmitting) return;
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    setIsSubmitting(true); // ✅ بدء التحميل

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.youtube_url) {
        formDataToSend.append('youtube_url', formData.youtube_url);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingExercise) {
        await apiFetch(`/exercise/${editingExercise.id}`, {
          method: 'POST',
          body: formDataToSend
        });
        toast.success('Exercise updated successfully!');
      } else {
        await apiFetch('/exercise/store', {
          method: 'POST',
          body: formDataToSend
        });
        toast.success('Exercise created successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchExercises();
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast.error(editingExercise ? 'Failed to update' : 'Failed to create');
    } finally {
      setIsSubmitting(false); // ✅ انتهى التحميل
    }
  };

  // حذف
  const handleDelete = async (exercise: Exercise) => {
    if (!confirm(`Are you sure you want to delete "${exercise.title}"?`)) return;
    
    try {
      await apiFetch(`/exercise/delete/${exercise.id}`, {
        method: 'DELETE',
      });
      toast.success('Exercise deleted successfully!');
      fetchExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error('Failed to delete');
    }
  };
  
  // فتح مودال التعديل
  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      title: exercise.title,
      description: exercise.description || '',
      image: null,
      youtube_url: exercise.youtube_url || '',
    });
    setImagePreview(exercise.image_url);
    setModalOpen(true);
  };

  // فتح مودال الإضافة
  const handleAdd = () => {
    setEditingExercise(null);
    setFormData({
      title: '',
      description: '',
      image: null,
      youtube_url: '',
    });
    setImagePreview(null);
    setModalOpen(true);
  };

  // إعادة تعيين الفورم
  const resetForm = () => {
    setEditingExercise(null);
    setFormData({
      title: '',
      description: '',
      image: null,
      youtube_url: '',
    });
    setImagePreview(null);
  };

  // معالجة اختيار الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // استخراج ID الفيديو لعرض المعاينة
  const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header - نفس الكود */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exercises</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your exercise library
            </p>
          </div>
          
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Exercise
          </button>
        </div>

        {/* Table - نفس الكود */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="mt-2 text-gray-500">No exercises found</p>
            <button
              onClick={handleAdd}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Create your first exercise →
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            {/* الجدول كما هو */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Video</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {exercises.map((exercise) => (
                    <tr key={exercise.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      {/* نفس الأعمدة */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">#{exercise.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {exercise.image_url ? (
                          <img 
                            src={exercise.image_url} 
                            alt={exercise.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {exercise.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {exercise.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {exercise.youtube_url ? (
                          <a 
                            href={exercise.youtube_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10 15l5-3-5-3v6z M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                            </svg>
                            Watch
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No video</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(exercise.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(exercise)}
                            className="text-blue-600 hover:text-blue-800 transition px-2 py-1 rounded"
                            title="Edit"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exercise)}
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

        {/* Modal Form مع تعطيل الزر أثناء الإرسال */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
                  </h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-2xl"
                  >
                    ✖
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* نفس الحقول */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter exercise title"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the exercise"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Image
                    </label>
                    {imagePreview && (
                      <div className="mb-2">
                        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtu.be/..."
                      disabled={isSubmitting}
                    />
                    {formData.youtube_url && getYoutubeEmbedUrl(formData.youtube_url) && (
                      <div className="mt-2">
                        <iframe 
                          src={getYoutubeEmbedUrl(formData.youtube_url)!} 
                          title="Video Preview"
                          className="w-full h-48 rounded-lg"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>

                  {/* Buttons مع تعطيل الزر أثناء الإرسال */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {editingExercise ? 'Updating...' : 'Creating...'}
                        </div>
                      ) : (
                        editingExercise ? 'Update' : 'Create'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition font-medium"
                      disabled={isSubmitting}
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
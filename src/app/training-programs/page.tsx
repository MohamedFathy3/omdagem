/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/MainLayout';

interface TrainingProgram {
  id: number;
  title: string;
  description: string | null;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  days: any[];
  created_at: string;
}

export default function TrainingProgramsList() {
  const router = useRouter();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [programToDuplicate, setProgramToDuplicate] = useState<TrainingProgram | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/training-program/index', {
        method: 'POST',
        body: JSON.stringify({ filters: {}, orderBy: 'id', orderByDirection: 'desc', perPage: 100, paginate: true }),
      });
      setPrograms(response.data || []);
    } catch (error) {
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiFetch('/user/index', {
        method: 'POST',
        body: JSON.stringify({ filters: {}, perPage: 100 }),
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchUsers();
  }, []);

  const handleDelete = async (program: TrainingProgram) => {
    if (!confirm(`Are you sure you want to delete "${program.title}"? This action cannot be undone.`)) return;
    
    try {
      const response = await apiFetch(`/training-program/delete/${program.id}`, {
        method: 'DELETE',
      });
      
      if (response.success) {
        toast.success('Program deleted successfully!');
        fetchPrograms();
      } else {
        toast.error(response.message || 'Failed to delete program');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete program');
    }
  };

  const handleDuplicate = async () => {
    if (!programToDuplicate || !selectedUserId) {
      toast.error('Please select a student');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await apiFetch('/training-program/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program_id: programToDuplicate.id,
          user_id: parseInt(selectedUserId),
          title: `${programToDuplicate.title} (Copy)`
        })
      });
      
      if (response.success) {
        toast.success('Program duplicated successfully!');
        setDuplicateModalOpen(false);
        setProgramToDuplicate(null);
        setSelectedUserId('');
        fetchPrograms();
      } else {
        toast.error(response.message || 'Failed to duplicate program');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to duplicate program');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = (program: TrainingProgram) => {
    router.push(`/training-programs/${program.id}`);
  };

  const handleEdit = (program: TrainingProgram) => {
    router.push(`/training-programs/edit/${program.id}`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Training Programs</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create and manage personalized workout programs for your students
                </p>
              </div>
              <button
                onClick={() => router.push('/training-programs/create')}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Program
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No programs</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first program.</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/training-programs/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Program
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <div key={program.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{program.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{program.user?.name || 'Unknown'}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleView(program)} className="p-1.5 text-gray-400 hover:text-blue-500 transition rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" title="View">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button onClick={() => handleEdit(program)} className="p-1.5 text-gray-400 hover:text-yellow-500 transition rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => { setProgramToDuplicate(program); setDuplicateModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-purple-500 transition rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20" title="Duplicate">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(program)} className="p-1.5 text-gray-400 hover:text-red-500 transition rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {program.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{program.description}</p>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {program.days?.length || 0} days
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {program.days?.reduce((sum, d) => sum + (d.exercises?.length || 0), 0) || 0} exercises
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Duplicate Modal */}
      {duplicateModalOpen && programToDuplicate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setDuplicateModalOpen(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-auto shadow-xl">
              <button onClick={() => setDuplicateModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">✖</button>
              <h3 className="text-lg font-medium mb-4 pr-6">Duplicate Program</h3>
              <p className="text-sm text-gray-500 mb-4">Copy {programToDuplicate.title} to another student</p>
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 mb-4 p-2">
                <option value="">Select student</option>
                {users.map((user) => (<option key={user.id} value={String(user.id)}>{user.name} - {user.email}</option>))}
              </select>
              <div className="flex gap-3">
                <button onClick={handleDuplicate} disabled={isSubmitting} className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
                  {isSubmitting ? 'Duplicating...' : 'Duplicate'}
                </button>
                <button onClick={() => setDuplicateModalOpen(false)} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
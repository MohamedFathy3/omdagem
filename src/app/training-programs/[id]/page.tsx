/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/MainLayout';

interface TrainingProgram {
  id: number;
  title: string;
  description: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  days: {
    id: number;
    day_number: number;
    title: string;
    exercises: {
      id: number;
      sets: number | null;
      reps: number | null;
      rest_seconds: number | null;
      exercise: {
        id: number;
        title: string;
        description: string | null;
        image_url: string | null;
        youtube_url: string | null;
      };
    }[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function ViewProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id;
  
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'days'>('overview');

  useEffect(() => {
    fetchProgram();
  }, [programId]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/training-program/show/${programId}`, {
        method: 'GET',
      });
      setProgram(response.data);
    } catch (error) {
      console.error('Error fetching program:', error);
      toast.error('Failed to load program');
      router.push('/training-programs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${program?.title}"? This action cannot be undone.`)) return;
    
    try {
      const response = await apiFetch(`/training-program/delete/${programId}`, {
        method: 'DELETE',
      });
      
      if (response.success) {
        toast.success('Program deleted successfully!');
        router.push('/training-programs');
      } else {
        toast.error(response.message || 'Failed to delete program');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete program');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!program) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="text-gray-500">Program not found</p>
          <button onClick={() => router.push('/training-programs')} className="mt-4 text-blue-600">
            Back to Programs
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="mb-4 text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{program.title}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  👤 {program.user.name} • {program.user.email}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/training-programs/edit/${program.id}`)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          {program.description && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 dark:text-gray-300">{program.description}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('days')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'days'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Training Days ({program.days.length})
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{program.days.length}</div>
                  <div className="text-sm text-gray-500">Total Days</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {program.days.reduce((sum, day) => sum + day.exercises.length, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Exercises</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {program.days.reduce((sum, day) => sum + (day.exercises.reduce((s, ex) => s + (ex.sets || 0), 0)), 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Sets</div>
                </div>
              </div>

              {/* Days Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Days Overview</h2>
                <div className="space-y-3">
                  {program.days.map((day) => (
                    <div key={day.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <span className="font-medium">Day {day.day_number}:</span> {day.title}
                      </div>
                      <span className="text-sm text-gray-500">{day.exercises.length} exercises</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Days Tab */}
          {activeTab === 'days' && (
            <div className="space-y-6">
              {program.days.map((day, dayIndex) => (
                <div key={day.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">Day {day.day_number}: {day.title}</h3>
                    <p className="text-blue-100 text-sm">{day.exercises.length} exercises</p>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {day.exercises.map((exercise, exIndex) => (
                      <div key={exercise.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <div className="flex gap-4">
                          {exercise.exercise.image_url && (
                            <img 
                              src={exercise.exercise.image_url} 
                              alt={exercise.exercise.title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{exercise.exercise.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              {exercise.exercise.description}
                            </p>
                            <div className="flex gap-3 mt-2">
                              {exercise.sets && (
                                <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs">
                                  🔄 {exercise.sets} sets
                                </span>
                              )}
                              {exercise.reps && (
                                <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-xs">
                                  🔁 {exercise.reps} reps
                                </span>
                              )}
                              {exercise.rest_seconds && (
                                <span className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded text-xs">
                                  ⏱️ {exercise.rest_seconds}s rest
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/MainLayout';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Types
interface Exercise {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
}

interface ProgramExercise {
  id: number;
  exercise_id: number;
  sets: string;
  reps: string;
  rest_seconds: string;
}

interface ProgramDay {
  id: number;
  day_number: number;
  title: string;
  exercises: ProgramExercise[];
}

// Sortable Exercise in Day
const DayExerciseItem = ({ exercise, index, onRemove, onUpdate, exercisesList }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const selectedExercise = exercisesList.find((ex: any) => ex.id === exercise.exercise_id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-2"
    >
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        
        {selectedExercise?.image_url && (
          <img src={selectedExercise.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
        )}
        
        <select
          value={exercise.exercise_id}
          onChange={(e) => onUpdate('exercise_id', parseInt(e.target.value))}
          className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
        >
          <option value={0}>Select exercise</option>
          {exercisesList.map((ex: any) => (
            <option key={ex.id} value={ex.id}>{ex.title}</option>
          ))}
        </select>
        
        <input
          type="number"
          placeholder="Sets"
          value={exercise.sets}
          onChange={(e) => onUpdate('sets', e.target.value)}
          className="w-20 px-2 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 text-center"
        />
        <input
          type="number"
          placeholder="Reps"
          value={exercise.reps}
          onChange={(e) => onUpdate('reps', e.target.value)}
          className="w-20 px-2 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 text-center"
        />
        <input
          type="number"
          placeholder="Rest"
          value={exercise.rest_seconds}
          onChange={(e) => onUpdate('rest_seconds', e.target.value)}
          className="w-20 px-2 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 text-center"
        />
        
        <button onClick={onRemove} className="text-red-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Sortable Day
const SortableDay = ({ day, dayIndex, onUpdateDay, onRemoveDay, onAddExercise, onUpdateExercise, onRemoveExercise, exercisesList }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: day.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border mb-4 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab text-white/70">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <span className="text-white font-bold">Day {dayIndex + 1}</span>
          <input
            type="text"
            value={day.title}
            onChange={(e) => onUpdateDay('title', e.target.value)}
            placeholder="Day title"
            className="px-3 py-1 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none"
          />
        </div>
        <button onClick={onRemoveDay} className="text-white/70 hover:text-red-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">{day.exercises.length} exercises</span>
          <button
            onClick={onAddExercise}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
          >
            + Add Exercise
          </button>
        </div>
        
        <DndContext>
          <SortableContext items={day.exercises.map((ex: any) => ex.id)} strategy={verticalListSortingStrategy}>
            {day.exercises.map((exercise: any, exIdx: number) => (
              <DayExerciseItem
                key={exercise.id}
                exercise={exercise}
                index={exIdx}
                onRemove={() => onRemoveExercise(exIdx)}
                onUpdate={(field: string, value: any) => onUpdateExercise(exIdx, field, value)}
                exercisesList={exercisesList}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

// Available Exercise Card for Drag
const AvailableExercise = ({ exercise, onDragStart }: any) => {
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  
  const handleDragStart = (e: React.DragEvent) => {
    setIsDraggingLocal(true);
    onDragStart(exercise);
    e.dataTransfer.setData('exerciseId', exercise.id.toString());
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  const handleDragEnd = () => {
    setIsDraggingLocal(false);
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-all ${
        isDraggingLocal ? 'opacity-50' : ''
      }`}
    >
      <div className="flex gap-3">
        {exercise.image_url && (
          <img src={exercise.image_url} alt={exercise.title} className="w-16 h-16 rounded-lg object-cover" />
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">{exercise.title}</h4>
          <p className="text-xs text-gray-500 line-clamp-2">{exercise.description}</p>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function CreateProgramPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropDay, setActiveDropDay] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    description: '',
    days: [] as ProgramDay[],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, exercisesRes] = await Promise.all([
        apiFetch('/user/index', { method: 'POST', body: JSON.stringify({ filters: {}, perPage: 100 }) }),
        apiFetch('/exercise/index', { method: 'POST', body: JSON.stringify({ filters: {}, perPage: 100 }) }),
      ]);
      setUsers(usersRes.data || []);
      setExercises(exercisesRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop for Days
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = formData.days.findIndex((day) => day.id === active.id);
      const newIndex = formData.days.findIndex((day) => day.id === over?.id);
      const newDays = arrayMove(formData.days, oldIndex, newIndex);
      newDays.forEach((day, idx) => (day.day_number = idx + 1));
      setFormData({ ...formData, days: newDays });
    }
  };

  // Handle drop from available exercises
  const handleDropOnDay = (dayIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    setActiveDropDay(null);
    
    const exerciseId = parseInt(e.dataTransfer.getData('exerciseId'));
    if (!exerciseId) return;
    
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;
    
    const newDays = [...formData.days];
    newDays[dayIndex].exercises.push({
      id: Date.now(),
      exercise_id: exercise.id,
      sets: '',
      reps: '',
      rest_seconds: '',
    });
    setFormData({ ...formData, days: newDays });
    toast.success(`Added ${exercise.title} to day ${dayIndex + 1}`);
  };

  const handleDragOver = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    setActiveDropDay(dayIndex);
  };

  const handleDragLeave = () => {
    setActiveDropDay(null);
  };

  // Day management
  const addDay = () => {
    setFormData({
      ...formData,
      days: [
        ...formData.days,
        { id: Date.now(), day_number: formData.days.length + 1, title: '', exercises: [] },
      ],
    });
  };

  const removeDay = (index: number) => {
    const newDays = [...formData.days];
    newDays.splice(index, 1);
    newDays.forEach((day, idx) => (day.day_number = idx + 1));
    setFormData({ ...formData, days: newDays });
  };

  const updateDay = (index: number, field: string, value: any) => {
    const newDays = [...formData.days];
    newDays[index] = { ...newDays[index], [field]: value };
    setFormData({ ...formData, days: newDays });
  };

  // Exercise management in day
  const addExerciseToDay = (dayIndex: number) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises.push({
      id: Date.now(),
      exercise_id: 0,
      sets: '',
      reps: '',
      rest_seconds: '',
    });
    setFormData({ ...formData, days: newDays });
  };

  const removeExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setFormData({ ...formData, days: newDays });
  };

  const updateExerciseInDay = (dayIndex: number, exerciseIndex: number, field: string, value: any) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises[exerciseIndex] = {
      ...newDays[dayIndex].exercises[exerciseIndex],
      [field]: field === 'exercise_id' ? parseInt(value) : value,
    };
    setFormData({ ...formData, days: newDays });
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    if (!formData.title.trim()) return toast.error('Program title is required');
    if (!formData.user_id) return toast.error('Please select a student');
    if (formData.days.length === 0) return toast.error('At least one training day is required');

    setIsSubmitting(true);
    try {
      const payload = {
        user_id: parseInt(formData.user_id),
        title: formData.title,
        description: formData.description,
        days: formData.days.map(day => ({
          day_number: day.day_number,
          title: day.title,
          exercises: day.exercises
            .filter(ex => ex.exercise_id !== 0)
            .map(ex => ({
              exercise_id: ex.exercise_id,
              sets: ex.sets ? parseInt(ex.sets) : null,
              reps: ex.reps ? parseInt(ex.reps) : null,
              rest_seconds: ex.rest_seconds ? parseInt(ex.rest_seconds) : null,
            }))
        })).filter(day => day.exercises.length > 0)
      };

      await apiFetch('/training-program/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      toast.success('Program created successfully!');
      router.push('/training-programs');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create program');
    } finally {
      setIsSubmitting(false);
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Program</h1>
            <p className="mt-1 text-sm text-gray-500">Drag exercises from the right panel to build your program</p>
          </div>

          <div className="flex gap-6">
            {/* Left Side - Form */}
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Program Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Student *</label>
                      <select
                        value={formData.user_id}
                        onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                        required
                      >
                        <option value="">Select student</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>{user.name} - {user.email}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Program Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                        placeholder="e.g., 8-Week Strength Program"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Program description..."
                    />
                  </div>
                </div>

                {/* Training Days */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Training Days</h2>
                    <button type="button" onClick={addDay} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                      + Add Day
                    </button>
                  </div>
                  
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={formData.days.map(d => d.id)} strategy={verticalListSortingStrategy}>
                      {formData.days.map((day, idx) => (
                        <div
                          key={day.id}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDrop={(e) => handleDropOnDay(idx, e)}
                          onDragLeave={handleDragLeave}
                          className={`transition-all duration-200 ${activeDropDay === idx ? 'ring-2 ring-blue-500 rounded-xl bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                          <SortableDay
                            day={day}
                            dayIndex={idx}
                            onUpdateDay={(f, v) => updateDay(idx, f, v)}
                            onRemoveDay={() => removeDay(idx)}
                            onAddExercise={() => addExerciseToDay(idx)}
                            onUpdateExercise={(exIdx, f, v) => updateExerciseInDay(idx, exIdx, f, v)}
                            onRemoveExercise={(exIdx) => removeExerciseFromDay(idx, exIdx)}
                            exercisesList={exercises}
                          />
                        </div>
                      ))}
                    </SortableContext>
                  </DndContext>
                  
                  {formData.days.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <p>No training days yet</p>
                      <button type="button" onClick={addDay} className="mt-2 text-blue-600">Add your first day</button>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Program'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/training-programs')}
                    className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Exercises Library */}
            <div className="w-96 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Exercises Library
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">Drag any exercise and drop it on a day</p>
                  
                  <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {exercises.map((exercise) => (
                      <AvailableExercise key={exercise.id} exercise={exercise} onDragStart={() => {}} />
                    ))}
                    {exercises.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No exercises found. Create some first.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
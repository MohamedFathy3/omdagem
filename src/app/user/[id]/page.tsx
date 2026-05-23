// app/back/user/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  Clock,
  User,
  CheckCircle,
  Activity,
  Target,
  Droplets,
  Sun,
  Moon,
  Brain,
  Heart,
  AlertCircle,
  Pill,
  Coffee,
  Ruler,
  Weight,
  TrendingUp,
  ClipboardList,
  FileText,
  Package,
  Award,
  Zap
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';

interface UserData {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  training_level: string;
  your_daily_life: string | null;
  avalid_problem: string | null;
  number_of_meals: string;
  water_intake: string;
  dietary_supplements: string;
  number_of_hours_per_day: string;
  sleep_quality: string | null;
  stress_level: string | null;
  note: string;
  package: {
    id: number;
    title: string;
    time: string | null;
    price: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchUserData();
    }
  }, [params.id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiFetch(`/user/${params.id}`);
      
      if (data.result === 'Success') {
        setUser(data.data);
      } else {
        setError(data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const parseNotes = (note: string) => {
    const sections: { [key: string]: string } = {};
    const lines = note.split('\n');
    let currentSection = '';
    
    for (const line of lines) {
      if (line.includes('===')) {
        currentSection = line.replace(/=/g, '').trim();
      } else if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        sections[key.trim()] = value;
      }
    }
    return sections;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading user data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {error ? 'Error Loading User' : 'User Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The user you are looking for does not exist.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/user')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Users
              </button>
              {error && (
                <button
                  onClick={fetchUserData}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const notesData = parseNotes(user.note);
  const bmi = (parseFloat(user.weight) / Math.pow(parseFloat(user.height) / 100, 2)).toFixed(1);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/user')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                User ID: #{String(user.id).padStart(4, '0')}
              </p>
            </div>
          </div>
          
          {/* Package Badge */}
          {user.package && (
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium flex items-center gap-2">
                <Award size={16} />
                {user.package.title}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                  <User size={64} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {user.role === 'user' ? 'Member' : user.role}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur">
                  <Phone size={20} className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur">
                  <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Joined</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.createdAt}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur">
                  <Clock size={20} className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Last Updated</div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.updatedAt}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Information */}
            {user.package && (
              <div className="rounded-2xl shadow-xl bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package size={20} className="text-yellow-500" />
                  Current Package
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.package.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.package.description}</div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                      ${user.package.price}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Physical Information */}
            <div className="rounded-2xl shadow-xl bg-white dark:bg-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity size={24} className="text-blue-600" />
                Physical Information
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-blue-600" />
                    <span className="text-xs text-gray-500">Age</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.age}</div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler size={16} className="text-green-600" />
                    <span className="text-xs text-gray-500">Height</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.height} cm</div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight size={16} className="text-orange-600" />
                    <span className="text-xs text-gray-500">Weight</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.weight} kg</div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-purple-600" />
                    <span className="text-xs text-gray-500">BMI</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{bmi}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Goal</div>
                  <div className="font-medium text-gray-900 dark:text-white mt-1">{user.goal}</div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Training Level</div>
                  <div className="font-medium text-gray-900 dark:text-white mt-1">{user.training_level}</div>
                </div>
              </div>
            </div>

            {/* Lifestyle Information */}
            <div className="rounded-2xl shadow-xl bg-white dark:bg-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Sun size={24} className="text-yellow-600" />
                Lifestyle & Habits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Coffee size={20} className="text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Meals per day</div>
                    <div className="font-medium">{user.number_of_meals} meals</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Droplets size={20} className="text-cyan-600" />
                  <div>
                    <div className="text-xs text-gray-500">Water intake</div>
                    <div className="font-medium">{user.water_intake} glasses/day</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Pill size={20} className="text-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">Supplements</div>
                    <div className="font-medium">{user.dietary_supplements} types</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Clock size={20} className="text-purple-600" />
                  <div>
                    <div className="text-xs text-gray-500">Active hours/day</div>
                    <div className="font-medium">{user.number_of_hours_per_day} hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Notes */}
            {notesData && Object.keys(notesData).length > 0 && (
              <div className="rounded-2xl shadow-xl bg-white dark:bg-gray-800 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <ClipboardList size={24} className="text-red-600" />
                  Health Assessment
                </h3>
                
                <div className="space-y-4">
                  {/* Injuries */}
                  {notesData['الإصابات'] && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={18} className="text-red-600" />
                        <span className="font-semibold text-red-700 dark:text-red-300">Injuries</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{notesData['الإصابات']}</p>
                    </div>
                  )}
                  
                  {/* Observations */}
                  {notesData['الملاحظات'] && (
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={18} className="text-yellow-600" />
                        <span className="font-semibold text-yellow-700 dark:text-yellow-300">Observations</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{notesData['الملاحظات']}</p>
                    </div>
                  )}
                  
                  {/* Commitment */}
                  {notesData['الالتزام بالأيام'] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div className="text-sm text-gray-500">Weekly Commitment</div>
                        <div className="font-semibold text-green-700 dark:text-green-300">{notesData['الالتزام بالأيام']}</div>
                      </div>
                      
                      {notesData['الالتزام بالدايت'] && (
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <div className="text-sm text-gray-500">Diet Commitment</div>
                          <div className="font-semibold text-blue-700 dark:text-blue-300">{notesData['الالتزام بالدايت']}</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Measurements */}
                  {notesData['القياسات'] && (
                    <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler size={18} className="text-purple-600" />
                        <span className="font-semibold text-purple-700 dark:text-purple-300">Body Measurements</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{notesData['القياسات']}</p>
                    </div>
                  )}
                  
                  {/* Chronic Diseases */}
                  {notesData['أمراض مزمنة'] && notesData['أمراض مزمنة'] !== 'لا يوجد' && (
                    <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart size={18} className="text-orange-600" />
                        <span className="font-semibold text-orange-700 dark:text-orange-300">Chronic Conditions</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{notesData['أمراض مزمنة']}</p>
                    </div>
                  )}
                  
                  {/* Medications */}
                  {notesData['أدوية'] && notesData['أدوية'] !== 'لا يوجد' && (
                    <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill size={18} className="text-indigo-600" />
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300">Medications</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{notesData['أدوية']}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {user.note && user.note.includes('ملاحظات إضافية من العميل') && (
              <div className="rounded-2xl shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  Client Notes
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {user.note.split('ملاحظات إضافية من العميل')[1]?.trim() || 'No additional notes'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/back/user/[id]/page.tsx
'use client';
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  Clock,
  User,
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
  Dumbbell,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Wallet,
  CalendarDays
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// ✅ تحديث الـ Types حسب الـ JSON الجديد
interface Price {
  id: number;
  months: number;
  price: string;
}

interface PackageData {
  id: number;
  title: string;
  description: string;
  active: boolean;
  selected_price: Price | null;
  all_prices: Price[];
}

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  age: string;
  weight: string;
  height: string;
  goal: string;
  training_level: string;
  image_url: string | null;
  front_image_url: string | null;
  back_image_url: string | null;
  right_image_url: string | null;
  left_image_url: string | null;
  inbody_images_urls: string[];
  avalid_problem: string;
  your_daily_lifestyle: string | null;
  number_of_meals: string;
  water_intake: string;
  dietary_supplements: string;
  number_of_hours_per_day: string;
  sleep_quality: string;
  stress_level: string;
  note: string;
  package: PackageData;
  workout_history?: any[];
  workout_stats?: {
    total_workouts: number;
    total_exercises: number;
    total_sets: number;
    last_workout: string | null;
  };
  created_at: string;
  updated_at: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'workout' | 'photos' | 'notes' | 'package'>('overview');

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

  const getTrainingLevelText = (level: string) => {
    const levels: { [key: string]: string } = {
      'beginner': 'مبتدئ',
      'intermediate': 'متوسط',
      'advanced': 'متقدم'
    };
    return levels[level] || level;
  };

  const getSleepQualityText = (quality: string) => {
    const qualities: { [key: string]: string } = {
      'poor': 'سيء',
      'moderate': 'متوسط',
      'good': 'جيد',
      'excellent': 'ممتاز'
    };
    return qualities[quality] || quality;
  };

  const getStressLevelText = (level: string) => {
    const levels: { [key: string]: string } = {
      'low': 'منخفض',
      'medium': 'متوسط',
      'high': 'مرتفع'
    };
    return levels[level] || level;
  };

  const calculateBMI = () => {
    if (!user) return null;
    const heightM = parseFloat(user.height) / 100;
    const weight = parseFloat(user.weight);
    if (heightM > 0 && weight > 0) {
      return (weight / (heightM * heightM)).toFixed(1);
    }
    return null;
  };

  const parseNoteSections = () => {
    if (!user?.note) return {};
    
    const sections: { [key: string]: string } = {};
    const lines = user.note.split('\n');
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        if (key && value && !key.includes('===')) {
          sections[key.trim()] = value;
        }
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
            <p className="text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
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
              {error ? 'خطأ في التحميل' : 'المستخدم غير موجود'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'المستخدم الذي تبحث عنه غير موجود'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/user')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                العودة للقائمة
              </button>
              {error && (
                <button
                  onClick={fetchUserData}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  إعادة المحاولة
                </button>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const bmi = calculateBMI();
  const noteSections = parseNoteSections();
  const totalWorkouts = user.workout_stats?.total_workouts || 0;
  const totalExercises = user.workout_stats?.total_exercises || 0;
  const totalSets = user.workout_stats?.total_sets || 0;
  const selectedPrice = user.package?.selected_price;
  const allPrices = user.package?.all_prices || [];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <MainLayout>
        <div className="container mx-auto px-4 py-8" dir="rtl">
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: #{String(user.id).padStart(4, '0')} | عضو منذ: {new Date(user.created_at).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>
            
            {/* Package Badge */}
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium flex items-center gap-2 shadow-lg">
                <Award size={16} />
                {user.package?.title || 'باقة غير محددة'}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Dumbbell size={24} />
                <span className="text-2xl font-bold">{totalWorkouts}</span>
              </div>
              <p className="text-sm opacity-90">إجمالي التمارين</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Activity size={24} />
                <span className="text-2xl font-bold">{totalExercises}</span>
              </div>
              <p className="text-sm opacity-90">تمارين مسجلة</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Target size={24} />
                <span className="text-2xl font-bold">{totalSets}</span>
              </div>
              <p className="text-sm opacity-90">إجمالي المجموعات</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <Calendar size={24} />
                <span className="text-2xl font-bold">{user.workout_stats?.last_workout ? '✅' : '❌'}</span>
              </div>
              <p className="text-sm opacity-90">
                آخر تمرين: {user.workout_stats?.last_workout ? new Date(user.workout_stats.last_workout).toLocaleDateString('ar-EG') : 'لا يوجد'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                <User size={18} />
                نظرة عامة
              </button>
              <button
                onClick={() => setActiveTab('package')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'package'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                <Package size={18} />
                الباقة والاشتراك
              </button>
              <button
                onClick={() => setActiveTab('workout')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'workout'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                <Dumbbell size={18} />
                سجل التمارين
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'photos'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                صور الجسم
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                <ClipboardList size={18} />
                الملاحظات
              </button>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <Phone size={20} className="text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">رقم الهاتف</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <div>
                        <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                        <p className="font-medium text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Activity size={20} />
                      القياسات الحيوية
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <p className="text-2xl font-bold text-blue-600">{user.age}</p>
                        <p className="text-xs text-gray-500">العمر</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                        <p className="text-2xl font-bold text-green-600">{user.height}</p>
                        <p className="text-xs text-gray-500">الطول (سم)</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                        <p className="text-2xl font-bold text-orange-600">{user.weight}</p>
                        <p className="text-xs text-gray-500">الوزن (كجم)</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                        <p className="text-2xl font-bold text-purple-600">{bmi}</p>
                        <p className="text-xs text-gray-500">مؤشر كتلة الجسم</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Dumbbell size={20} />
                      معلومات التدريب
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                        <p className="text-sm text-gray-500">الهدف</p>
                        <p className="font-bold text-lg mt-1">{user.goal}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                        <p className="text-sm text-gray-500">مستوى التدريب</p>
                        <p className="font-bold text-lg mt-1">{getTrainingLevelText(user.training_level)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                        <p className="text-sm text-gray-500">ساعات التدريب يومياً</p>
                        <p className="font-bold text-lg mt-1">{user.number_of_hours_per_day} ساعات</p>
                      </div>
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                        <p className="text-sm text-gray-500">الإصابات / المشاكل</p>
                        <p className="font-bold text-red-600 mt-1">{user.avalid_problem || 'لا يوجد'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Sun size={20} />
                      نمط الحياة
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <Coffee size={18} />
                        <div>
                          <p className="text-xs text-gray-500">الوجبات</p>
                          <p className="font-medium">{user.number_of_meals} وجبات/يوم</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <Droplets size={18} className="text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">الماء</p>
                          <p className="font-medium">{user.water_intake} لتر/يوم</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <Pill size={18} className="text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">المكملات</p>
                          <p className="font-medium capitalize">{user.dietary_supplements}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <Moon size={18} className="text-indigo-500" />
                        <div>
                          <p className="text-xs text-gray-500">جودة النوم</p>
                          <p className="font-medium">{getSleepQualityText(user.sleep_quality)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <Brain size={18} className="text-yellow-500" />
                        <div>
                          <p className="text-xs text-gray-500">مستوى التوتر</p>
                          <p className="font-medium">{getStressLevelText(user.stress_level)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ ✅ ✅ Package Tab - الباقة والاشتراك */}
              {activeTab === 'package' && (
                <div className="space-y-6">
                  {/* Package Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Package size={32} />
                      <h2 className="text-2xl font-bold">{user.package?.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
                        <p className="text-sm opacity-90">المدة المختارة</p>
                        <p className="text-2xl font-bold">{selectedPrice?.months} شهر</p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
                        <p className="text-sm opacity-90">السعر المختار</p>
                        <p className="text-2xl font-bold">{selectedPrice?.price} $</p>
                      </div>
                    </div>
                  </div>

                  {/* Package Description */}
                  {user.package?.description && (
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-6">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <FileText size={18} />
                        وصف الباقة
                      </h3>
                      <div 
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: user.package.description }}
                      />
                    </div>
                  )}

                  {/* All Prices */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <CreditCard size={18} />
                      جميع أسعار الباقة
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allPrices.map((price) => (
                        <div 
                          key={price.id}
                          className={`rounded-xl p-4 border-2 transition-all ${
                            selectedPrice?.id === price.id
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={18} className="text-emerald-500" />
                              <span className="font-bold text-lg">{price.months}</span>
                              <span className="text-sm text-gray-500">شهر</span>
                            </div>
                            {selectedPrice?.id === price.id && (
                              <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
                                المختار
                              </span>
                            )}
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {price.price} $
                            </p>
                            <p className="text-sm text-gray-500">
                              { (parseFloat(price.price) / price.months).toFixed(2) } $/شهر
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subscription Summary */}
                  <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Wallet size={18} />
                      ملخص الاشتراك
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">اسم الباقة</span>
                        <span className="font-bold">{user.package?.title}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">المدة</span>
                        <span className="font-bold">{selectedPrice?.months} أشهر</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">السعر الإجمالي</span>
                        <span className="font-bold text-xl text-emerald-600">{selectedPrice?.price} $</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-600 dark:text-gray-400">السعر الشهري</span>
                        <span className="font-medium">
                          {selectedPrice ? (parseFloat(selectedPrice.price) / selectedPrice.months).toFixed(2) : 0} $/شهر
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Workout History Tab */}
              {activeTab === 'workout' && (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {user.workout_history && user.workout_history.length > 0 ? (
                    user.workout_history.map((workout) => (
                      <div key={workout.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                          className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex justify-between items-center hover:from-blue-600 hover:to-blue-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar size={18} />
                            <span className="font-bold">
                              {new Date(workout.date).toLocaleDateString('ar-EG')}
                            </span>
                            <span className="px-2 py-1 bg-white/20 rounded text-sm">
                              {workout.training_day}
                            </span>
                          </div>
                          {expandedWorkout === workout.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        
                        {expandedWorkout === workout.id && (
                          <div className="p-4 overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                  <th className="text-right p-2">التمرين</th>
                                  <th className="text-center p-2">المجموعة</th>
                                  <th className="text-center p-2">الوزن</th>
                                  <th className="text-center p-2">العدات</th>
                                </tr>
                              </thead>
                              <tbody>
                                {workout.exercises?.map((exercise: { exercise_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; set_number: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; weight: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; reps: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, idx: Key | null | undefined) => (
                                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                                    <td className="p-2 font-medium">{exercise.exercise_name}</td>
                                    <td className="text-center p-2">{exercise.set_number}</td>
                                    <td className="text-center p-2">{exercise.weight}</td>
                                    <td className="text-center p-2">{exercise.reps}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Dumbbell size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">لا يوجد سجل تمارين حتى الآن</p>
                    </div>
                  )}
                </div>
              )}

              {/* Photos Tab */}
              {activeTab === 'photos' && (
                <div>
                  {(user.front_image_url || user.back_image_url || user.right_image_url || user.left_image_url || (user.inbody_images_urls && user.inbody_images_urls.length > 0)) ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.front_image_url && (
                          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img src={user.front_image_url} alt="Front" className="w-full h-auto" />
                            <p className="text-center p-2 text-sm">الواجهة الأمامية</p>
                          </div>
                        )}
                        {user.back_image_url && (
                          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img src={user.back_image_url} alt="Back" className="w-full h-auto" />
                            <p className="text-center p-2 text-sm">الواجهة الخلفية</p>
                          </div>
                        )}
                        {user.right_image_url && (
                          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img src={user.right_image_url} alt="Right" className="w-full h-auto" />
                            <p className="text-center p-2 text-sm">الجهة اليمنى</p>
                          </div>
                        )}
                        {user.left_image_url && (
                          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img src={user.left_image_url} alt="Left" className="w-full h-auto" />
                            <p className="text-center p-2 text-sm">الجهة اليسرى</p>
                          </div>
                        )}
                      </div>

                      {user.inbody_images_urls && user.inbody_images_urls.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-4">صور InBody</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {user.inbody_images_urls.map((url, idx) => (
                              <div key={idx} className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img src={url} alt={`InBody ${idx + 1}`} className="w-full h-auto" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">لا توجد صور متاحة</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {Object.keys(noteSections).length > 0 && (
                    <div className="space-y-3">
                      {noteSections['الإصابات'] && noteSections['الإصابات'] !== 'لا يوجد' && (
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={18} className="text-red-600" />
                            <span className="font-bold text-red-700">الإصابات</span>
                          </div>
                          <p>{noteSections['الإصابات']}</p>
                        </div>
                      )}
                      
                      {noteSections['الملاحظات'] && noteSections['الملاحظات'] !== 'لا يوجد' && (
                        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText size={18} className="text-yellow-600" />
                            <span className="font-bold text-yellow-700">الملاحظات</span>
                          </div>
                          <p>{noteSections['الملاحظات']}</p>
                        </div>
                      )}

                      {noteSections['الالتزام بالأيام'] && (
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={18} className="text-green-600" />
                            <span className="font-bold text-green-700">الالتزام</span>
                          </div>
                          <p>الأيام: {noteSections['الالتزام بالأيام']}</p>
                          {noteSections['الالتزام بالدايت'] && <p>الدايت: {noteSections['الالتزام بالدايت']}</p>}
                        </div>
                      )}

                      {noteSections['القياسات'] && (
                        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Ruler size={18} className="text-purple-600" />
                            <span className="font-bold text-purple-700">القياسات</span>
                          </div>
                          <p>{noteSections['القياسات']}</p>
                        </div>
                      )}

                      {noteSections['أمراض مزمنة'] && noteSections['أمراض مزمنة'] !== 'لا يوجد' && (
                        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart size={18} className="text-orange-600" />
                            <span className="font-bold text-orange-700">الأمراض المزمنة</span>
                          </div>
                          <p>{noteSections['أمراض مزمنة']}</p>
                        </div>
                      )}

                      {noteSections['أدوية'] && noteSections['أدوية'] !== 'لا يوجد' && (
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Pill size={18} className="text-blue-600" />
                            <span className="font-bold text-blue-700">الأدوية</span>
                          </div>
                          <p>{noteSections['أدوية']}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {user.note && user.note.includes('ملاحظات إضافية') && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardList size={18} />
                        <span className="font-bold">ملاحظات إضافية من العميل</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {user.note.split('ملاحظات إضافية')[1]?.replace(/=/g, '').trim() || 'لا توجد ملاحظات إضافية'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}

// Icons
function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
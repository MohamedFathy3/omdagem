// components/Tablecomponents/MediaSelector.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, X, Filter, Grid, List, 
  Image as ImageIcon, Video, File, Music, FileText, FileArchive
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface MediaItem {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  authorId: number | null;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

interface MediaSelectorProps {
  value: number | string | null;
  onChange: (value: number | string | null) => void;
  label?: string;
  required?: boolean;
  endpoint?: string;
  type?: 'image' | 'file' | 'all';
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  value,
  onChange,
  label = "Media",
  required = false,
  endpoint = "/media",
  type = "all"
}) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all');

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ استخدم apiFetch مباشرة دون .json()
      const data = await apiFetch(`${endpoint}`);
      
      console.log('📥 Media API Response:', data);
      
      if (data.status === 'success' || data.result === 'Success') {
        // تحقق من هيكل البيانات
        let mediaData: MediaItem[] = [];
        
        if (Array.isArray(data.data)) {
          mediaData = data.data;
        } else if (data.data && Array.isArray(data.data.data)) {
          mediaData = data.data.data;
        } else if (Array.isArray(data)) {
          mediaData = data;
        }
        
        setMedia(mediaData);
        setFilteredMedia(mediaData);
        console.log('✅ Loaded media items:', mediaData.length);
      } else {
        throw new Error(data.message || 'Failed to load media');
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      setError(error instanceof Error ? error.message : 'Failed to load media');
      setMedia([]);
      setFilteredMedia([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // فلترة الوسائط حسب البحث والنوع
  useEffect(() => {
    let results = media;

    // فلترة حسب النوع
    if (selectedType !== 'all') {
      if (selectedType === 'image') {
        results = results.filter(item => item.mimeType.startsWith('image/'));
      } else if (selectedType === 'video') {
        results = results.filter(item => item.mimeType.startsWith('video/'));
      } else if (selectedType === 'audio') {
        results = results.filter(item => item.mimeType.startsWith('audio/'));
      } else if (selectedType === 'document') {
        results = results.filter(item => 
          item.mimeType.includes('pdf') || 
          item.mimeType.includes('word') || 
          item.mimeType.includes('excel') ||
          item.mimeType.includes('text')
        );
      } else if (selectedType === 'archive') {
        results = results.filter(item => 
          item.mimeType.includes('zip') || 
          item.mimeType.includes('rar') ||
          item.mimeType.includes('tar') ||
          item.mimeType.includes('7z')
        );
      }
    }

    // فلترة حسب البحث
    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.mimeType.toLowerCase().includes(searchTerm)
      );
    }

    // فلترة حسب النوع المحدد في props
    if (type !== 'all') {
      if (type === 'image') {
        results = results.filter(item => item.mimeType.startsWith('image/'));
      } else if (type === 'file') {
        results = results.filter(item => !item.mimeType.startsWith('image/'));
      }
    }

    setFilteredMedia(results);
  }, [media, search, selectedType, type]);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6 text-green-500" />;
    } else if (mimeType.startsWith('video/')) {
      return <Video className="w-6 h-6 text-purple-500" />;
    } else if (mimeType.startsWith('audio/')) {
      return <Music className="w-6 h-6 text-yellow-500" />;
    } else if (mimeType.includes('pdf') || mimeType.includes('document')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
      return <FileArchive className="w-6 h-6 text-orange-500" />;
    } else {
      return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word')) return 'Word';
    if (mimeType.includes('excel')) return 'Excel';
    if (mimeType.includes('zip')) return 'ZIP';
    if (mimeType.includes('rar')) return 'RAR';
    return 'File';
  };

  const handleSelect = (item: MediaItem) => {
    onChange(item.id);
  };

  const handleClear = () => {
    onChange(null);
    setSearch('');
  };

  const handleRetry = () => {
    fetchMedia();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading media...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Error Loading Media</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
          </button>
          
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-full text-sm ${selectedType === 'all' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('image')}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${selectedType === 'image' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            <ImageIcon size={14} />
            Images
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('video')}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${selectedType === 'video' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            <Video size={14} />
            Videos
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('audio')}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${selectedType === 'audio' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            <Music size={14} />
            Audio
          </button>
        </div>
      </div>

      {/* Selected Item Preview */}
      {value && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                {(() => {
                  const selectedItem = media.find(item => item.id === value || item.id.toString() === value);
                  return selectedItem ? getFileIcon(selectedItem.mimeType) : <File className="w-5 h-5 text-blue-500" />;
                })()}
              </div>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">
                  {(() => {
                    const selectedItem = media.find(item => item.id === value || item.id.toString() === value);
                    return selectedItem?.name || 'Selected Media';
                  })()}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  ID: {value}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Media List/Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <File className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No media found</p>
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' : 'space-y-2'} max-h-96 overflow-y-auto p-1`}>
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`
                relative group cursor-pointer transition-all rounded-lg border-2 overflow-hidden
                ${value === item.id || value === item.id.toString()
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-sm'
                }
                ${viewMode === 'grid' ? 'aspect-square' : ''}
              `}
            >
              {/* Preview */}
              <div className={`${viewMode === 'grid' ? 'h-2/3' : 'h-24'} w-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                {item.mimeType.startsWith('image/') ? (
                  <img
                    src={item.fullUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback إذا فشل تحميل الصورة
                      (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" fill="#f3f4f6"/>
                          <text x="50" y="50" font-family="Arial" font-size="10" fill="#9ca3af" text-anchor="middle" dy=".3em">${getFileType(item.mimeType)}</text>
                        </svg>
                      `)}`;
                    }}
                  />
                ) : (
                  <div className="text-center p-4">
                    {getFileIcon(item.mimeType)}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                      {getFileType(item.mimeType)}
                    </p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={`p-3 ${viewMode === 'grid' ? 'h-1/3' : ''}`}>
                <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-200">
                  {item.name}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(item.size)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {item.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                </div>
              </div>

              {/* Selection Indicator */}
              {(value === item.id || value === item.id.toString()) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Media Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <span>
          Showing {filteredMedia.length} of {media.length} items
        </span>
        {value && (
          <button
            type="button"
            onClick={() => {
              const selectedItem = media.find(item => item.id === value || item.id.toString() === value);
              if (selectedItem) {
                window.open(selectedItem.fullUrl, '_blank');
              }
            }}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Preview selected
          </button>
        )}
      </div>
    </div>
  );
};
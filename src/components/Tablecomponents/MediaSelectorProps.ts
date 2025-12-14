// components/Tablecomponents/MediaSelectorProps.ts
export interface MediaItem {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  previewUrl: string;
  fullUrl: string;
  createdAt: string;
}

export interface MediaSelectorProps {
  value: number | string | null;
  onChange: (value: number | string | null) => void;
  label?: string;
  required?: boolean;
  endpoint?: string;
  type?: 'image' | 'file' | 'all';
  accept?: string;
}
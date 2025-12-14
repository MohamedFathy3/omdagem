// components/Tablecomponents/MediaOrUploadSelectorProps.ts
export interface MediaOrUploadSelectorProps {
  value: number | string | File | null;
  onChange: (value: number | string | File | null) => void;
  label?: string;
  required?: boolean;
  endpoint?: string;
  type?: 'image' | 'file' | 'all';
  accept?: string;
}
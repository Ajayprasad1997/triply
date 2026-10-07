import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import {
  CloudArrowUp,
  Image as ImageIcon,
  Trash,
  ArrowsClockwise,
  CheckCircle,
  LinkSimple,
  ShieldCheck,
  Sparkle,
  Copy,
  Check
} from '@phosphor-icons/react';

interface S3ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  bucketPath?: string;
  helperText?: string;
  className?: string;
}

export const S3ImageUploader: React.FC<S3ImageUploaderProps> = ({
  value,
  onChange,
  label = 'High-Resolution Image *',
  required = true,
  bucketPath = 'gallery/showcase',
  helperText = 'Files are encrypted at rest and uploaded through a short-lived signed URL.',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFileUpload = async (file: File) => {
    setErrorMsg('');

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP, AVIF).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 25MB maximum limit.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);
    setUploadStatusText('Requesting a secure upload URL...');

    try {
      setUploadProgress(35);
      setUploadStatusText('Encrypting and uploading image to object storage...');
      const uploaded = await api.createImageUpload(file, bucketPath);
      setUploadProgress(100);
      setUploadStatusText('Upload complete!');
      onChange(uploaded.url);
    } catch (error) {
      setUploadProgress(0);
      setErrorMsg(error instanceof Error ? error.message : 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileUpload(e.target.files[0]);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrorMsg('');
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Header Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${activeTab === 'upload'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <CloudArrowUp size={13} weight="bold" />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${activeTab === 'url'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <LinkSimple size={13} weight="bold" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Upload State or Value Preview */}
      {value ? (
        /* Image Preview Box */
        <div className="relative group bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="relative h-48 sm:h-56 w-full bg-slate-950 flex items-center justify-center">
            <img
              src={value}
              alt="Uploaded showcase preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

            {/* Action Buttons Overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-[11px] font-bold backdrop-blur-md transition-all flex items-center gap-1 shadow-md cursor-pointer"
                title="Copy Image URI"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'upload') {
                    fileInputRef.current?.click();
                  } else {
                    handleClear();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-[11px] font-bold backdrop-blur-md transition-all flex items-center gap-1 shadow-md cursor-pointer"
              >
                <ArrowsClockwise size={13} />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-xl bg-rose-500/90 hover:bg-rose-600 text-white text-[11px] font-bold backdrop-blur-md transition-all flex items-center justify-center shadow-md cursor-pointer"
                title="Remove image"
              >
                <Trash size={14} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'upload' ? (
        /* Drag & Drop S3 Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${isDragging
            ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20'
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-3 py-2 animate-in fade-in duration-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs animate-bounce">
                <CloudArrowUp size={26} weight="bold" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{uploadStatusText}</p>
                <p className="text-[10px] text-slate-500 font-medium">Encrypting and publishing to AWS S3 Bucket...</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                <CloudArrowUp size={26} weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-800">
                  Click to browse or drag & drop high-res image
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Direct upload to <span className="font-mono text-emerald-700 font-bold">AWS S3 Bucket</span> (JPG, PNG, WEBP, AVIF up to 25MB)
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-[10px] font-bold">
                <Sparkle size={12} weight="fill" />
                <span>Encrypted direct upload</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Direct URL Input Mode */
        <div className="space-y-2">
          <div className="relative">
            <LinkSimple size={18} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              required={required}
              placeholder="https://images.unsplash.com/... or https://bucket.s3.amazonaws.com/..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-slate-900 transition-all"
            />
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Paste any direct HTTPS image URL from Unsplash, AWS S3, or external CDN repository.
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1 animate-in fade-in">
          <span>⚠️ {errorMsg}</span>
        </p>
      )}

      {/* Helper Footer Badge */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-1">
        <span className="flex items-center gap-1">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>{helperText}</span>
        </span>
        <span className="font-mono text-slate-400">S3-compatible storage</span>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { CheckCircle, CloudArrowUp, Eye, SpinnerGap, Trash } from '@phosphor-icons/react';
import { api } from '../services/api';

interface S3FileUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  required?: boolean;
  bucketPath: string;
}

export const S3FileUploader: React.FC<S3FileUploaderProps> = ({
  value,
  onChange,
  label,
  required = false,
  bucketPath
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file?: File) => {
    if (!file) return;
    setError('');
    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a PDF, JPG, PNG, or WEBP file.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('The file must be 25 MB or smaller.');
      return;
    }

    setUploading(true);
    try {
      const uploaded = await api.createFileUpload(file, bucketPath);
      onChange(uploaded.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-extrabold uppercase tracking-wide text-slate-700">
        {label}{required && <span className="text-rose-500"> *</span>}
      </label>
      <input
        ref={inputRef}
        type="file"
        aria-required={required}
        accept="application/pdf,image/jpeg,image/png,image/webp"
        onChange={event => upload(event.target.files?.[0])}
        className="hidden"
      />
      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
          <span className="flex min-w-0 items-center gap-2 text-xs font-bold text-emerald-800">
            <CheckCircle size={18} weight="fill" className="shrink-0" /> File uploaded
          </span>
          <span className="flex shrink-0 gap-2">
            <a href={value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-blue-700 shadow-sm">
              <Eye size={14} /> View file
            </a>
            <button type="button" onClick={() => onChange('')} aria-label={`Remove ${label}`} className="rounded-lg bg-white p-2 text-rose-600 shadow-sm">
              <Trash size={14} weight="bold" />
            </button>
          </span>
        </div>
      ) : (
        <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-xs font-extrabold text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 disabled:opacity-60">
          {uploading ? <SpinnerGap size={19} className="animate-spin" /> : <CloudArrowUp size={19} weight="bold" />}
          {uploading ? 'Uploading securely to S3…' : 'Choose file from device'}
        </button>
      )}
      <p className="text-[10px] font-medium text-slate-500">PDF, JPG, PNG, or WEBP · maximum 25 MB</p>
      {error && <p role="alert" className="text-[11px] font-bold text-rose-600">{error}</p>}
    </div>
  );
};

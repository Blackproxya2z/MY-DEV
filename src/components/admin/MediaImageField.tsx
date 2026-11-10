'use client';

import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Check, Sparkles } from 'lucide-react';
import { MediaAsset } from '@/lib/schemas';

export async function compressImageFileToJpgDataUrl(
  file: File,
  maxWidth = 1280,
  quality = 0.85
): Promise<{
  dataUrl: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}> {
  // Keep SVG or PDF as-is
  if (file.type === 'image/svg+xml' || file.type === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || '');
        resolve({
          dataUrl: result,
          filename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = String(reader.result || '');
      const img = new window.Image();
      img.onload = () => {
        try {
          let targetWidth = img.width || 800;
          let targetHeight = img.height || 600;
          if (targetWidth > maxWidth) {
            const ratio = maxWidth / targetWidth;
            targetWidth = Math.round(targetWidth * ratio);
            targetHeight = Math.round(targetHeight * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              dataUrl: rawDataUrl,
              filename: file.name,
              mimeType: file.type || 'image/jpeg',
              sizeBytes: file.size,
            });
            return;
          }

          // Fill subtle dark canvas background for transparent PNGs converted to JPG
          ctx.fillStyle = '#0B0D14';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          const jpgDataUrl = canvas.toDataURL('image/jpeg', quality);
          const baseName = file.name.replace(/\.[^.]+$/, '');
          const cleanName = `${baseName}.jpg`;
          const approxBytes = Math.round((jpgDataUrl.length * 3) / 4);

          resolve({
            dataUrl: jpgDataUrl,
            filename: cleanName,
            mimeType: 'image/jpeg',
            sizeBytes: approxBytes,
          });
        } catch {
          resolve({
            dataUrl: rawDataUrl,
            filename: file.name,
            mimeType: file.type || 'image/jpeg',
            sizeBytes: file.size,
          });
        }
      };
      img.onerror = () => {
        resolve({
          dataUrl: rawDataUrl,
          filename: file.name,
          mimeType: file.type || 'image/jpeg',
          sizeBytes: file.size,
        });
      };
      img.src = rawDataUrl;
    };
    reader.onerror = () => reject(new Error('Unable to read selected image file'));
    reader.readAsDataURL(file);
  });
}

export function MediaImageField({
  label,
  value,
  altValue,
  onChangeUrl,
  onChangeAlt,
  mediaAssets = [],
  onUploadAsset,
  testIdPrefix = 'media-field',
  helperText = 'Upload a .JPG / .PNG photo from your computer or select from the Media Library.',
}: {
  label: string;
  value?: string | null;
  altValue?: string;
  onChangeUrl: (url: string) => void;
  onChangeAlt?: (alt: string) => void;
  mediaAssets?: MediaAsset[];
  onUploadAsset?: (asset: {
    filename: string;
    public_url: string;
    mime_type: string;
    size_bytes: number;
    alt_text: string;
    caption: string;
  }) => Promise<unknown>;
  testIdPrefix?: string;
  helperText?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLibraryPicker, setShowLibraryPicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const optimized = await compressImageFileToJpgDataUrl(file);
      const defaultAlt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      if (onUploadAsset) {
        await onUploadAsset({
          filename: optimized.filename,
          public_url: optimized.dataUrl,
          mime_type: optimized.mimeType,
          size_bytes: optimized.sizeBytes,
          alt_text: altValue || defaultAlt,
          caption: `Uploaded via ${label}`,
        });
      }
      onChangeUrl(optimized.dataUrl);
      if (onChangeAlt && !altValue) {
        onChangeAlt(defaultAlt);
      }
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="rounded-xl border border-border bg-canvas/80 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-accent block">
            {label}
          </label>
          <p className="text-[11px] text-muted">{helperText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.gif,.svg,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            data-testid={`${testIdPrefix}-file-input`}
            className="hidden"
          />

          <button
            type="button"
            data-testid={`${testIdPrefix}-upload-btn`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-canvas font-semibold text-xs hover:opacity-95 transition-opacity"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Optimizing JPG...' : 'Upload JPG / Photo'}</span>
          </button>

          <button
            type="button"
            data-testid={`${testIdPrefix}-library-btn`}
            onClick={() => setShowLibraryPicker((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-raised text-xs font-mono text-fg hover:border-accent"
          >
            <ImageIcon className="w-3.5 h-3.5 text-highlight" />
            <span>Media Library ({mediaAssets.length})</span>
          </button>

          {value ? (
            <button
              type="button"
              onClick={() => onChangeUrl('')}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg border border-border bg-raised text-xs font-mono text-rose-400 hover:border-rose-400"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Live Visual Preview + URL / Alt Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-4 aspect-[16/10] rounded-xl border border-border bg-raised overflow-hidden flex items-center justify-center relative">
          {value ? (
            <img
              src={value}
              alt={altValue || label}
              data-testid={`${testIdPrefix}-preview-img`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-3 space-y-1">
              <Sparkles className="w-5 h-5 text-muted mx-auto" />
              <span className="text-[10px] font-mono text-muted block">No JPG Selected</span>
            </div>
          )}
        </div>

        <div className="sm:col-span-8 space-y-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-muted">
              Image URL or Uploaded JPG Data URI
            </label>
            <input
              type="text"
              data-testid={`${testIdPrefix}-url-input`}
              value={value || ''}
              onChange={(e) => onChangeUrl(e.target.value)}
              placeholder="Upload a .jpg above or paste https://..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-raised text-xs text-fg font-mono"
            />
          </div>

          {onChangeAlt ? (
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted">
                Image Alt Text (SEO &amp; Accessibility)
              </label>
              <input
                type="text"
                data-testid={`${testIdPrefix}-alt-input`}
                value={altValue || ''}
                onChange={(e) => onChangeAlt(e.target.value)}
                placeholder="Describe this photo"
                className="w-full px-3 py-2 rounded-lg border border-border bg-raised text-xs text-fg"
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* WordPress-Style Visual Media Library Grid Drawer */}
      {showLibraryPicker ? (
        <div className="pt-3 border-t border-border/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-highlight uppercase">
              Select from Uploaded Media Library
            </span>
            <button
              type="button"
              onClick={() => setShowLibraryPicker(false)}
              className="text-xs font-mono text-muted hover:text-fg"
            >
              Close ✕
            </button>
          </div>

          {mediaAssets.length === 0 ? (
            <p className="text-xs text-muted py-3">
              No images in Media Library yet. Click &ldquo;Upload JPG / Photo&rdquo; above to upload
              from your computer.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto p-1">
              {mediaAssets
                .filter((m) => m.mime_type.startsWith('image/'))
                .map((asset) => {
                  const isSelected = value === asset.public_url;
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        onChangeUrl(asset.public_url);
                        if (onChangeAlt && asset.alt_text) {
                          onChangeAlt(asset.alt_text);
                        }
                        setShowLibraryPicker(false);
                      }}
                      className={`group relative aspect-square rounded-lg overflow-hidden border text-left transition-all ${
                        isSelected
                          ? 'border-accent ring-2 ring-accent/40'
                          : 'border-border hover:border-accent/60'
                      }`}
                    >
                      <img
                        src={asset.public_url}
                        alt={asset.alt_text}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-canvas/90 px-1.5 py-1 text-[10px] font-mono text-fg truncate">
                        {asset.filename}
                      </div>
                      {isSelected ? (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-accent text-canvas flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}


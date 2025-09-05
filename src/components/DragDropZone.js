'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileVideo, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DragDropZone({ onFileSelect, selectedFile, error }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const isValidVideoFile = (file) => {
    const validTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
      'video/mkv',
      'video/3gp',
      'video/ogv',
      'video/m4v'
    ];
    
    const validExtensions = [
      '.mp4', '.avi', '.mov', '.wmv', '.flv', 
      '.webm', '.mkv', '.3gp', '.ogv', '.m4v'
    ];
    
    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    return hasValidType || hasValidExtension;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidVideoFile(file)) {
        onFileSelect(file);
      } else {
        onFileSelect(null, 'กรุณาเลือกไฟล์วิดีโอที่รองรับ (MP4, AVI, MOV, WMV, FLV, WebM, MKV, 3GP, OGV, M4V)');
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && isValidVideoFile(file)) {
      onFileSelect(file);
    } else {
      onFileSelect(null, 'กรุณาเลือกไฟล์วิดีโอที่รองรับ (MP4, AVI, MOV, WMV, FLV, WebM, MKV, 3GP, OGV, M4V)');
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50",
          error && "border-destructive bg-destructive/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.3gp,.ogv,.m4v,video/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
              <FileVideo className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="inline-flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
              ลบไฟล์
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-muted rounded-full">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                ลากไฟล์วิดีโอมาวางที่นี่
              </p>
              <p className="text-sm text-muted-foreground">
                หรือ <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  คลิกเพื่อเลือกไฟล์
                </button>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              รองรับไฟล์วิดีโอ: MP4, AVI, MOV, WMV, FLV, WebM, MKV, 3GP, OGV, M4V
            </p>
            <p className="text-xs text-muted-foreground">
              ขนาดสูงสุด 500MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}

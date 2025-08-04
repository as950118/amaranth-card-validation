'use client';

import { useState } from 'react';
import { parseFileData, ExpenseRecord } from '@/lib/validation';
import { UploadIcon, CheckIcon, PlusIcon, AlertIcon } from './icons';

interface FileUploadProps {
  onDataLoaded: (data: ExpenseRecord[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    await processFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await parseFileData(file);
      onDataLoaded(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`파일을 읽는 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`transition-all duration-300 ${
          isDragOver ? 'scale-[1.02]' : 'scale-100'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-blue-400 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/60 shadow-xl'
              : 'border-slate-300 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/30 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50/60 hover:via-indigo-50/40 hover:to-purple-50/40 hover:shadow-lg'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-10 h-10 border-3 border-slate-200 border-t-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <span className="text-lg font-medium text-slate-700">파일 처리 중...</span>
                <span className="text-sm text-slate-500 mt-1">잠시만 기다려주세요</span>
              </div>
            ) : (
              <>
                <div className="relative mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <UploadIcon className="text-white" size="lg" />
                  </div>
                  {isDragOver && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                      <CheckIcon className="text-blue-600" size="sm" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="mb-3 text-lg font-semibold text-slate-700">
                    <span className="font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">클릭하여 업로드</span> 또는 드래그 앤 드롭
                  </p>
                  <p className="text-sm text-slate-500 mb-6">
                    엑셀 파일 (.xlsx, .xls) 또는 텍스트 파일 (.txt)을 업로드해주세요
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white rounded-xl shadow-lg hover:from-slate-800 hover:via-slate-700 hover:to-slate-600 transition-all duration-300 font-medium hover:shadow-xl transform hover:scale-105">
                    <PlusIcon className="text-white" size="sm" />
                    파일 선택
                  </div>
                </div>
              </>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.txt"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 border border-red-200 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <AlertIcon className="text-red-500 flex-shrink-0" size="sm" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
} 
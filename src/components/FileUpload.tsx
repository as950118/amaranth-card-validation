'use client';

import { useState } from 'react';
import { parseExcelData, ExpenseRecord } from '@/lib/validation';

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
      const data = await parseExcelData(file);
      onDataLoaded(data);
    } catch (err) {
      setError('파일을 읽는 중 오류가 발생했습니다. 엑셀 파일(.xlsx)인지 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative transition-all duration-300 ${
          isDragOver ? 'scale-105' : 'scale-100'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-blue-400 bg-blue-50/50'
              : 'border-gray-300 bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/30'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <span className="mt-4 text-lg font-medium text-gray-600">파일 처리 중...</span>
                <span className="text-sm text-gray-500">잠시만 기다려주세요</span>
              </div>
            ) : (
              <>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  {isDragOver && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="mb-2 text-xl font-semibold text-gray-700">
                    <span className="font-bold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    엑셀 파일 (.xlsx, .xls)을 업로드해주세요
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
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
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in slide-in-from-top-2">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
} 
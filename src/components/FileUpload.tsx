'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { parseTextData, parseFileData, serializeRecordsToText, ExpenseRecord } from '@/lib/validation';
import { downloadExampleText } from '@/lib/exampleData';
import { encodePayload } from '@/lib/urlPayload';
import { AlertIcon, AttachIcon, DownloadIcon } from './icons';

interface FileUploadProps {
  initialText?: string;
  onDataLoaded: (data: ExpenseRecord[]) => void;
  /** 검증 후 공유 링크가 준비되면 호출 (이력에 저장용) */
  onShareLinkReady?: (url: string) => void;
}

export default function FileUpload({ initialText = '', onDataLoaded, onShareLinkReady }: FileUploadProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textValue, setTextValue] = useState(initialText);
  const hasAutoValidated = useRef(false);

  // URL에서 받은 초기 텍스트가 있으면 textarea에 반영
  useEffect(() => {
    if (initialText) setTextValue(initialText);
  }, [initialText]);

  // URL 쿼리로 들어온 텍스트는 한 번만 자동 검증
  useEffect(() => {
    if (!initialText.trim() || hasAutoValidated.current) return;
    hasAutoValidated.current = true;
    setError(null);
    setIsLoading(true);
    try {
      const data = parseTextData(initialText);
      onDataLoaded(data);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`텍스트를 파싱하는 중 오류가 발생했습니다: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, [initialText, onDataLoaded]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
    setError(null);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    setError(null);
    setIsLoading(true);
    try {
      const records = await parseFileData(file);
      onDataLoaded(records);
      // 엑셀/텍스트 업로드 결과도 hash에 저장 (탭 구분 텍스트로 직렬화 후 압축)
      const serialized = serializeRecordsToText(records);
      setTextValue(serialized);
      const encoded = await encodePayload(serialized);
      if (typeof window !== 'undefined') {
        const fullUrl = `${window.location.origin}${pathname}#d=${encoded}`;
        window.history.replaceState(null, '', `${pathname}#d=${encoded}`);
        onShareLinkReady?.(fullUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`파일 처리 중 오류: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    if (!textValue.trim()) {
      setError('텍스트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = parseTextData(textValue);
      onDataLoaded(data);
      // hash에 압축 저장 (서버로 안 보내서 431 방지, 공유/북마크 가능)
      const encoded = await encodePayload(textValue.trim());
      if (typeof window !== 'undefined') {
        const fullUrl = `${window.location.origin}${pathname}#d=${encoded}`;
        window.history.replaceState(null, '', `${pathname}#d=${encoded}`);
        onShareLinkReady?.(fullUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`텍스트를 파싱하는 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyShareLink = async () => {
    const text = textValue.trim();
    if (!text) return;
    try {
      const encoded = await encodePayload(text);
      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}${pathname}#d=${encoded}`;
      await navigator.clipboard.writeText(url);
      setError(null);
    } catch {
      setError('링크 복사에 실패했습니다.');
    }
  };

  const handleClear = () => {
    setTextValue('');
    setError(null);
  };

  const handleDownloadExample = () => {
    downloadExampleText();
  };

  return (
    <div className="w-full">
      {/* ChatGPT 스타일 입력 카드 - 둥근 박스 */}
      <div className="rounded-2xl border border-[#404040] bg-[#2f2f2f] shadow-lg overflow-hidden focus-within:border-[#565656] transition-colors">
        <div className="p-3 sm:p-4">
          <textarea
            value={textValue}
            onChange={handleTextChange}
            placeholder="지출 내역 텍스트를 붙여넣거나, 아래에서 엑셀 파일을 선택하세요..."
            className="w-full min-h-[140px] sm:min-h-[160px] px-0 py-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none resize-none"
            disabled={isLoading}
            rows={5}
          />
        </div>

        {/* 하단 액션 바 - ChatGPT 입력창 하단 스타일 */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border-t border-[#404040] bg-[#262626]/50">
          <div className="flex items-center gap-1">
            <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <AttachIcon className="text-current" size="md" />
              <span>엑셀 선택</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                disabled={isLoading}
                className="sr-only"
              />
            </label>
            <button
              type="button"
              onClick={handleDownloadExample}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <DownloadIcon className="text-current" size="xs" />
              <span>예시 다운로드</span>
            </button>
            {textValue.trim() && (
              <>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="현재 텍스트가 담긴 링크를 복사합니다"
                >
                  링크로 저장
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  지우기
                </button>
              </>
            )}
          </div>
          <button
            onClick={handlePaste}
            disabled={isLoading || !textValue.trim()}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-gray-900 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            title="검증하기"
            aria-label="검증하기"
          >
            {isLoading ? (
              <span className="text-xs font-medium text-gray-900">...</span>
            ) : (
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="inline-block shrink-0 text-gray-900" aria-hidden>
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 엑셀만 올렸을 때도 검증 가능하므로 안내 문구 */}
      <p className="mt-2 text-xs text-gray-500 text-center">
        엑셀(.xlsx, .xls) 또는 탭/줄바꿈으로 구분된 텍스트를 지원합니다
      </p>

      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-[#3d2a2a] border border-[#5c3a3a]">
          <AlertIcon className="text-[#f87171] shrink-0 mt-0.5" size="xs" />
          <p className="text-sm text-[#fca5a5]">{error}</p>
        </div>
      )}
    </div>
  );
}

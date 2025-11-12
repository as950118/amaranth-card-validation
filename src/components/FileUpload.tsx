'use client';

import { useState } from 'react';
import { parseTextData, ExpenseRecord } from '@/lib/validation';
import { AlertIcon, DownloadIcon } from './icons';

interface FileUploadProps {
  onDataLoaded: (data: ExpenseRecord[]) => void;
}

// 예시 파일 내용
const EXAMPLE_TEXT = `순번

거래일자

지출용도

내용

거래처

공급가액

부가세

합계

증빙

프로젝트

사원코드

1

2025.07.01

법인카드_식대(점심)

점심, 백승한

프랭크버거 여의도점

11,454

1,146

12,600

신용카드매출전표(법인)

공통(CMP모니터링팀)

백승한

2

2025.07.01

법인카드_식대(저녁)

저녁, 백승한

별미볶음점2호

11,818

1,182

13,000

신용카드매출전표(법인)

공통(CMP모니터링팀)

백승한

3

2025.07.02

법인카드_식대(점심)

점심, 백승한

지에스(GS)25 브라이튼 여의도1호

11,818

1,182

13,000

신용카드매출전표(법인)

공통(CMP모니터링팀)

백승한`;

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textValue, setTextValue] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
    setError(null);
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`텍스트를 파싱하는 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setTextValue('');
    setError(null);
  };

  const handleDownloadExample = () => {
    const blob = new Blob([EXAMPLE_TEXT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '예시_법인카드_지출내역.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">텍스트 입력</label>
          <button
            onClick={handleDownloadExample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1f2e] text-gray-300 rounded-lg hover:bg-[#1e293b] transition-colors text-xs font-medium"
          >
            <DownloadIcon className="text-gray-300" size="xs" />
            예시 파일 다운로드
          </button>
        </div>
        <div className="relative">
          <textarea
            value={textValue}
            onChange={handleTextChange}
            placeholder="법인카드 지출 내역 텍스트를 여기에 붙여넣어주세요..."
            className="w-full h-64 px-4 py-3 bg-[#0f1419] border border-[#1a1f2e] rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] resize-none font-mono"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePaste}
            disabled={isLoading || !textValue.trim()}
            className="flex-1 px-4 py-2.5 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '처리 중...' : '검증하기'}
          </button>
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="px-4 py-2.5 bg-[#1a1f2e] text-gray-300 rounded-lg hover:bg-[#1e293b] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            지우기
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-[#1a1f2e] border border-[#1e293b] rounded-lg">
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="font-medium text-gray-300">💡 사용 방법:</span> 예시 파일을 다운로드하여 형식을 확인하거나, 
          엑셀에서 데이터를 복사하여 위 텍스트 영역에 붙여넣으세요. 
          각 레코드는 11개 필드(순번, 거래일자, 지출용도, 내용, 거래처, 공급가액, 부가세, 합계, 증빙, 프로젝트, 사원코드)로 구성되며, 
          새 줄로 구분된 형식 또는 탭으로 구분된 형식을 지원합니다.
        </p>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-[#1a1f2e] border border-[#dc2626] rounded-lg">
          <div className="flex items-center gap-2">
            <AlertIcon className="text-[#f87171] flex-shrink-0" size="sm" />
            <p className="text-xs text-[#fca5a5]">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ValidationResults from '@/components/ValidationResults';
import { ExpenseRecord, validateCardExpenses } from '@/lib/validation';
import { sendCustomEvent } from '@/lib/datadog';
import { 
  DocumentIcon, 
  PlusIcon, 
  CheckCircleIcon
} from '@/components/icons';

export default function Home() {
  const [data, setData] = useState<ExpenseRecord[] | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleDataLoaded = (loadedData: ExpenseRecord[]) => {
    setData(loadedData);
    const result = validateCardExpenses(loadedData);
    setValidationResult(result);
    
    // Datadog 이벤트 전송
    sendCustomEvent('file_uploaded', {
      recordCount: loadedData.length,
      errorCount: result.errorCount,
      warningCount: result.warningCount,
      normalCount: result.normalCount,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* 헤더 */}
      <header className="bg-[#0f1419] border-b border-[#1a1f2e]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                법인카드 지출 내역 검증
              </h1>
              <p className="mt-1 text-sm text-gray-300">
                텍스트를 붙여넣어 지출 내역을 검증하세요
              </p>
            </div>
            {validationResult && (
              <button
                onClick={() => {
                  setData(null);
                  setValidationResult(null);
                  sendCustomEvent('new_file_upload_clicked');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-medium"
              >
                <PlusIcon className="text-white" size="sm" />
                새로 검증하기
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {!data ? (
          <div className="space-y-6">
            {/* 파일 업로드 섹션 */}
            <div className="bg-[#141923] rounded-lg border border-[#1a1f2e] p-8">
              <div className="text-center max-w-2xl mx-auto">
                <div className="w-12 h-12 bg-[#1e293b] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DocumentIcon className="text-[#60a5fa]" size="md" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  텍스트 붙여넣기
                </h2>
                <p className="text-sm text-gray-300 mb-6">
                  법인카드 지출 내역 텍스트를 붙여넣어주세요
                </p>
                <FileUpload onDataLoaded={handleDataLoaded} />
              </div>
            </div>

            {/* 사용법 안내 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#141923] rounded-lg border border-[#1a1f2e] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center">
                    <DocumentIcon className="text-[#34d399]" size="sm" />
                  </div>
                  <h3 className="text-base font-semibold text-white">텍스트 형식</h3>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#34d399] mt-0.5">•</span>
                    <span>예시 파일을 다운로드하여 형식 확인</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#34d399] mt-0.5">•</span>
                    <span>텍스트를 복사하여 붙여넣기</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#34d399] mt-0.5">•</span>
                    <span>필수 컬럼: 순번, 거래일자, 지출용도, 내용, 거래처, 공급가액, 부가세, 합계, 증빙, 프로젝트, 사원코드</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#34d399] mt-0.5">•</span>
                    <span>탭으로 구분된 형식 또는 새 줄로 구분된 형식 지원</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#141923] rounded-lg border border-[#1a1f2e] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="text-[#a78bfa]" size="sm" />
                  </div>
                  <h3 className="text-base font-semibold text-white">검증 규칙</h3>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#a78bfa] mt-0.5">•</span>
                    <span>점심/저녁 지출: "점심, 사원명" 형식</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#a78bfa] mt-0.5">•</span>
                    <span>사원코드와 내용의 사원명 일치 확인</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#a78bfa] mt-0.5">•</span>
                    <span>부가세 0원이 아니어야 함</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#a78bfa] mt-0.5">•</span>
                    <span>같은 날짜 지출 그룹화 표시</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                검증 결과
              </h2>
              <p className="text-sm text-gray-300">입력된 텍스트의 검증 결과입니다</p>
            </div>
            <ValidationResults result={validationResult} />
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-[#0f1419] border-t border-[#1a1f2e] mt-12">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
          <div className="text-center text-xs text-gray-300">
            <p>법인카드 지출 내역 검증 시스템</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

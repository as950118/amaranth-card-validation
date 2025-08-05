'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ValidationResults from '@/components/ValidationResults';
import { ExpenseRecord, validateCardExpenses } from '@/lib/validation';
import { sendCustomEvent } from '@/lib/datadog';
import { 
  DocumentIcon, 
  PlusIcon, 
  CheckCircleIcon, 
  ArrowUpIcon 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* 헤더 */}
      <header className="bg-white/80 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                법인카드 지출 내역
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">검증 시스템</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                엑셀 파일 또는 텍스트 파일을 업로드하여 법인카드 지출 내역을 빠르고 정확하게 검증하세요
              </p>
            </div>
            <div className="lg:w-80">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200/60 shadow-lg">
                <h3 className="font-semibold text-slate-900 mb-3">검증 규칙</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    <span>점심/저녁 지출 내용 형식</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <span>사원코드 일치 확인</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span>부가세 0원 검증</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                    <span>같은 날짜 그룹화</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* 파일 업로드 섹션 */}
          {!data && (
            <div className="bg-white/80 rounded-3xl shadow-xl border border-slate-200/60 p-12">
              <div className="text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <DocumentIcon className="text-white" size="xl" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                  파일 업로드
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  법인카드 지출 내역이 포함된 엑셀 파일 또는 텍스트 파일을 업로드해주세요
                </p>
                <FileUpload onDataLoaded={handleDataLoaded} />
              </div>
            </div>
          )}

          {/* 검증 결과 섹션 */}
          {validationResult && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    검증 결과
                  </h2>
                  <p className="text-slate-600 mt-2">업로드된 파일의 검증 결과입니다</p>
                </div>
                <button
                  onClick={() => {
                    setData(null);
                    setValidationResult(null);
                    sendCustomEvent('new_file_upload_clicked');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl hover:from-slate-800 hover:to-slate-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <PlusIcon className="text-white" size="sm" />
                  새 파일 업로드
                </button>
              </div>
              <ValidationResults result={validationResult} />
            </div>
          )}

          {/* 사용법 안내 */}
          {!data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 rounded-2xl shadow-xl border border-slate-200/60 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DocumentIcon className="text-white" size="md" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">파일 준비</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">엑셀 파일(.xlsx, .xls) 또는 텍스트 파일(.txt) 형식</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">다음 컬럼이 포함되어야 함:</span>
                  </div>
                  <div className="ml-5 text-sm text-slate-600 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-lg p-3 border border-slate-200/60">
                    순번, 거래일자, 지출용도, 내용, 거래처, 공급가액, 부가세, 합계, 증빙, 프로젝트, 사원코드
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">텍스트 파일은 탭으로 구분된 형식 지원</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl shadow-xl border border-slate-200/60 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircleIcon className="text-white" size="md" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">검증 규칙</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">점심/저녁 지출: "점심, 사원명" 형식</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">사원코드와 내용의 사원명 일치</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">부가세 0원이 아니어야 함</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">같은 날짜 지출 그룹화 표시</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white/80 border-t border-slate-200/60 mt-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ArrowUpIcon className="text-white" size="lg" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">법인카드 지출 내역 검증 시스템</h3>
            <p className="text-slate-600">엑셀 파일 또는 텍스트 파일을 업로드하여 지출 내역을 검증하세요</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
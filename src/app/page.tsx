'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ValidationResults from '@/components/ValidationResults';
import { ExpenseRecord, validateCardExpenses } from '@/lib/validation';

export default function Home() {
  const [data, setData] = useState<ExpenseRecord[] | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleDataLoaded = (loadedData: ExpenseRecord[]) => {
    setData(loadedData);
    const result = validateCardExpenses(loadedData);
    setValidationResult(result);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                법인카드 지출 내역
                <span className="block text-blue-600">검증 시스템</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                엑셀 파일을 업로드하여 법인카드 지출 내역을 빠르고 정확하게 검증하세요
              </p>
            </div>
            <div className="lg:w-80">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-semibold text-slate-900 mb-3">검증 규칙</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>점심/저녁 지출 내용 형식</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>사원코드 일치 확인</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>부가세 0원 검증</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
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
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-12">
              <div className="text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  엑셀 파일 업로드
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  법인카드 지출 내역이 포함된 엑셀 파일을 업로드해주세요
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
                  <h2 className="text-3xl font-bold text-slate-900">
                    검증 결과
                  </h2>
                  <p className="text-slate-600 mt-2">업로드된 파일의 검증 결과입니다</p>
                </div>
                <button
                  onClick={() => {
                    setData(null);
                    setValidationResult(null);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  새 파일 업로드
                </button>
              </div>
              <ValidationResults result={validationResult} />
            </div>
          )}

          {/* 사용법 안내 */}
          {!data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">파일 준비</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">엑셀 파일(.xlsx) 형식</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">다음 컬럼이 포함되어야 함:</span>
                  </div>
                  <div className="ml-5 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                    순번, 거래일자, 지출용도, 내용, 거래처, 공급가액, 부가세, 합계, 증빙, 프로젝트, 사원코드
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">검증 규칙</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">점심/저녁 지출: "점심, 사원명" 형식</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">사원코드와 내용의 사원명 일치</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">부가세 0원이 아니어야 함</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">같은 날짜 지출 그룹화 표시</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-slate-200/60 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">법인카드 지출 내역 검증 시스템</h3>
            <p className="text-slate-600">엑셀 파일을 업로드하여 지출 내역을 검증하세요</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="relative overflow-hidden bg-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                법인카드 지출 내역 검증 시스템
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                엑셀 파일을 업로드하여 법인카드 지출 내역을 검증하세요
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="text-sm font-semibold text-gray-900 mb-2">검증 규칙</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>1. 점심/저녁 지출 내용 형식</div>
                  <div>2. 사원코드 일치</div>
                  <div>3. 부가세 0원 검증</div>
                  <div>4. 같은 날짜 그룹화</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* 파일 업로드 섹션 */}
          {!data && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    엑셀 파일 업로드
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    법인카드 지출 내역이 포함된 엑셀 파일(.xlsx)을 업로드해주세요.
                    <br />
                    <span className="text-sm text-gray-500">드래그 앤 드롭으로 쉽게 업로드할 수 있습니다.</span>
                  </p>
                </div>
                <FileUpload onDataLoaded={handleDataLoaded} />
              </div>
            </div>
          )}

          {/* 검증 결과 섹션 */}
          {validationResult && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    검증 결과
                  </h2>
                  <p className="text-gray-600 mt-2">업로드된 파일의 검증 결과입니다.</p>
                </div>
                <button
                  onClick={() => {
                    setData(null);
                    setValidationResult(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  새 파일 업로드
                </button>
              </div>
              <ValidationResults result={validationResult} />
            </div>
          )}

          {/* 사용법 안내 */}
          {!data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5 rounded-3xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">파일 준비</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>엑셀 파일(.xlsx) 형식</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>다음 컬럼이 포함되어야 함:</span>
                    </li>
                    <li className="ml-5 text-sm text-gray-600">
                      순번, 거래일자, 지출용도, 내용, 거래처, 공급가액, 부가세, 합계, 증빙, 프로젝트, 사원코드
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-3xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">검증 규칙</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>점심/저녁 지출: "점심, 사원명" 형식</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>사원코드와 내용의 사원명 일치</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>부가세 0원이 아니어야 함</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>같은 날짜 지출 그룹화 표시</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">법인카드 지출 내역 검증 시스템</h3>
            <p className="text-gray-600">엑셀 파일을 업로드하여 지출 내역을 검증하세요</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
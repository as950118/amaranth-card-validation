'use client';

import { ValidationResult } from '@/lib/validation';

interface ValidationResultsProps {
  result: ValidationResult;
}

export default function ValidationResults({ result }: ValidationResultsProps) {
  const { errors, warnings, groupedExpenses, totalRows, errorCount, warningCount, normalCount } = result;

  return (
    <div className="space-y-8">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-3xl"></div>
          <div className="relative">
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalRows}</div>
            <div className="text-sm text-gray-600">전체 행 수</div>
            <div className="mt-2 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-bl-3xl"></div>
          <div className="relative">
            <div className="text-3xl font-bold text-red-600 mb-1">{errorCount}</div>
            <div className="text-sm text-gray-600">오류</div>
            <div className="mt-2 w-12 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-bl-3xl"></div>
          <div className="relative">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{warningCount}</div>
            <div className="text-sm text-gray-600">경고</div>
            <div className="mt-2 w-12 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-bl-3xl"></div>
          <div className="relative">
            <div className="text-3xl font-bold text-green-600 mb-1">{normalCount}</div>
            <div className="text-sm text-gray-600">정상</div>
            <div className="mt-2 w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 검증 결과 요약 */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative px-8 py-6 border-b border-gray-200/50">
          <h3 className="text-2xl font-bold text-gray-900">검증 결과 요약</h3>
        </div>
        <div className="relative p-8">
          {errorCount === 0 && warningCount === 0 ? (
            <div className="flex items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-semibold text-green-800">모든 항목이 조건을 만족합니다!</span>
                <p className="text-sm text-green-600 mt-1">검증을 통과했습니다.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {errors.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-red-700">오류 ({errors.length}건)</h4>
                  </div>
                  <div className="space-y-3">
                    {errors.map((error, index) => (
                      <div key={index} className="p-4 bg-red-50/80 border border-red-200 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-red-800">
                              {error.rowNum}행: {error.reason}
                            </div>
                            <div className="text-sm text-red-600 mt-1">
                              내용: {error.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {warnings.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-yellow-700">경고 ({warnings.length}건)</h4>
                  </div>
                  <div className="space-y-3">
                    {warnings.map((warning, index) => (
                      <div key={index} className="p-4 bg-yellow-50/80 border border-yellow-200 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-yellow-800">
                              {warning.rowNum}행: {warning.reason}
                            </div>
                            <div className="text-sm text-yellow-600 mt-1">
                              내용: {warning.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 그룹화된 지출 내역 */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5"></div>
        <div className="relative px-8 py-6 border-b border-gray-200/50">
          <h3 className="text-2xl font-bold text-gray-900">같은 날짜에 같은 지출용도 그룹</h3>
        </div>
        <div className="relative p-8">
          {groupedExpenses.length > 0 ? (
            <div className="space-y-6">
              {groupedExpenses.map((group, index) => (
                <div key={index} className="relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-6 shadow-lg">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-2xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {group.date} - {group.purpose}
                          </h4>
                          <span className="text-sm text-gray-500">({group.count}건)</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {group.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">
                                순번 {item.순번}: {item.내용}
                              </span>
                              <span className="text-sm text-gray-500 ml-3">
                                (사원: {item.사원코드})
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                            {item.합계.toLocaleString()}원
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <p className="text-gray-500">점심/저녁 지출이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
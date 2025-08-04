'use client';

import { ValidationResult } from '@/lib/validation';

interface ValidationResultsProps {
  result: ValidationResult;
}

export default function ValidationResults({ result }: ValidationResultsProps) {
  const { errors, warnings, groupedExpenses, totalRows, errorCount, warningCount, normalCount } = result;

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{totalRows}</div>
          <div className="text-sm text-gray-500">전체 행 수</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          <div className="text-sm text-gray-500">오류</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
          <div className="text-sm text-gray-500">경고</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{normalCount}</div>
          <div className="text-sm text-gray-500">정상</div>
        </div>
      </div>

      {/* 검증 결과 요약 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">검증 결과 요약</h3>
        </div>
        <div className="p-6">
          {errorCount === 0 && warningCount === 0 ? (
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">모든 항목이 조건을 만족합니다!</span>
            </div>
          ) : (
            <div className="space-y-4">
              {errors.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-red-700 mb-2">❌ 오류 ({errors.length}건)</h4>
                  <div className="space-y-2">
                    {errors.map((error, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-medium text-red-800">
                          {error.rowNum}행: {error.reason}
                        </div>
                        <div className="text-sm text-red-600 mt-1">
                          내용: {error.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {warnings.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-yellow-700 mb-2">⚠️ 경고 ({warnings.length}건)</h4>
                  <div className="space-y-2">
                    {warnings.map((warning, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-sm font-medium text-yellow-800">
                          {warning.rowNum}행: {warning.reason}
                        </div>
                        <div className="text-sm text-yellow-600 mt-1">
                          내용: {warning.content}
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
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">같은 날짜에 같은 지출용도 그룹</h3>
        </div>
        <div className="p-6">
          {groupedExpenses.length > 0 ? (
            <div className="space-y-4">
              {groupedExpenses.map((group, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold text-gray-900">
                      📅 {group.date} - {group.purpose}
                    </h4>
                    <span className="text-sm text-gray-500">({group.count}건)</span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            순번 {item.순번}: {item.내용}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            (사원: {item.사원코드})
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.합계.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">점심/저녁 지출이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
} 
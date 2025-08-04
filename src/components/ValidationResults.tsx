'use client';

import { ValidationResult } from '@/lib/validation';
import { 
  BarChartIcon, 
  XIcon, 
  WarningIcon, 
  CheckCircleIcon, 
  CheckCircleFilledIcon, 
  CalendarIcon,
  DocumentIcon
} from './icons';

interface ValidationResultsProps {
  result: ValidationResult;
}

export default function ValidationResults({ result }: ValidationResultsProps) {
  const { errors, warnings, groupedExpenses, totalRows, errorCount, warningCount, normalCount } = result;

  return (
    <div className="space-y-8">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BarChartIcon className="text-white" size="sm" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{totalRows}</div>
          <div className="text-sm text-slate-600">전체 행 수</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <XIcon className="text-white" size="sm" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">{errorCount}</div>
          <div className="text-sm text-slate-600">오류</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <WarningIcon className="text-white" size="sm" />
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-1">{warningCount}</div>
          <div className="text-sm text-slate-600">경고</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="text-white" size="sm" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-1">{normalCount}</div>
          <div className="text-sm text-slate-600">정상</div>
        </div>
      </div>

      {/* 검증 결과 요약 */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60">
        <div className="px-8 py-6 border-b border-slate-200/60">
          <h3 className="text-2xl font-bold text-slate-900">검증 결과 요약</h3>
        </div>
        <div className="p-8">
          {errorCount === 0 && warningCount === 0 ? (
            <div className="flex items-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                <CheckCircleFilledIcon className="text-white" size="md" />
              </div>
              <div>
                <span className="text-lg font-semibold text-emerald-800">모든 항목이 조건을 만족합니다!</span>
                <p className="text-sm text-emerald-600 mt-1">검증을 통과했습니다.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {errors.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                      <XIcon className="text-white" size="xs" />
                    </div>
                    <h4 className="text-lg font-semibold text-red-700">오류 ({errors.length}건)</h4>
                  </div>
                  <div className="space-y-3">
                    {errors.map((error, index) => (
                      <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
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
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                      <WarningIcon className="text-white" size="xs" />
                    </div>
                    <h4 className="text-lg font-semibold text-yellow-700">경고 ({warnings.length}건)</h4>
                  </div>
                  <div className="space-y-3">
                    {warnings.map((warning, index) => (
                      <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
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
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60">
        <div className="px-8 py-6 border-b border-slate-200/60">
          <h3 className="text-2xl font-bold text-slate-900">같은 날짜에 같은 지출용도 그룹</h3>
        </div>
        <div className="p-8">
          {groupedExpenses.length > 0 ? (
            <div className="space-y-6">
              {groupedExpenses.map((group, index) => (
                <div key={index} className="bg-slate-50 rounded-2xl border border-slate-200/60 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <CalendarIcon className="text-white" size="sm" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">
                          {group.date} - {group.purpose}
                        </h4>
                        <span className="text-sm text-slate-500">({group.count}건)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/60">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-900">
                              순번 {item.순번}: {item.내용}
                            </span>
                            <span className="text-sm text-slate-500">
                              (사원: {item.사원코드})
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">
                          {item.합계.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DocumentIcon className="text-slate-400" size="lg" />
              </div>
              <p className="text-slate-500">점심/저녁 지출이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
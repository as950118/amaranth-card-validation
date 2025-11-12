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
    <div className="space-y-4">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#141923] rounded-lg border border-[#1a1f2e] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center">
              <BarChartIcon className="text-[#60a5fa]" size="sm" />
            </div>
          </div>
          <div className="text-xl font-bold text-white mb-0.5">{totalRows}</div>
          <div className="text-xs text-gray-300">전체 행 수</div>
        </div>
        
        <div className="bg-[#141923] rounded-lg border border-[#1a1f2e] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center">
              <XIcon className="text-[#f87171]" size="sm" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#f87171] mb-0.5">{errorCount}</div>
          <div className="text-xs text-gray-300">오류</div>
        </div>
        
        <div className="bg-[#141923] rounded-lg border border-[#1a1f2e] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center">
              <WarningIcon className="text-[#fbbf24]" size="sm" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#fbbf24] mb-0.5">{warningCount}</div>
          <div className="text-xs text-gray-300">경고</div>
        </div>
        
        <div className="bg-[#141923] rounded-lg border border-[#1a1f2e] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="text-[#34d399]" size="sm" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#34d399] mb-0.5">{normalCount}</div>
          <div className="text-xs text-gray-300">정상</div>
        </div>
      </div>

      {/* 검증 결과 요약 */}
      <div className="bg-[#141923] rounded-lg border border-[#1a1f2e]">
        <div className="px-6 py-4 border-b border-[#1a1f2e]">
          <h3 className="text-base font-semibold text-white">검증 결과 요약</h3>
        </div>
        <div className="p-6">
          {errorCount === 0 && warningCount === 0 ? (
            <div className="flex items-center p-3 bg-[#1e293b] border border-[#34d399] rounded-lg">
              <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center mr-3">
                <CheckCircleFilledIcon className="text-[#34d399]" size="sm" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#34d399]">모든 항목이 조건을 만족합니다!</span>
                <p className="text-xs text-[#6ee7b7] mt-0.5">검증을 통과했습니다.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {errors.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-5 h-5 bg-[#1e293b] rounded-lg flex items-center justify-center mr-2">
                      <XIcon className="text-[#f87171]" size="xs" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">오류 ({errors.length}건)</h4>
                  </div>
                  <div className="space-y-1.5">
                    {errors.map((error, index) => (
                      <div key={index} className="p-2.5 bg-[#1e293b] border border-[#dc2626] rounded-lg">
                        <div className="text-xs font-medium text-[#fca5a5]">
                          {error.rowNum}행: {error.reason}
                        </div>
                        <div className="text-xs text-[#f87171] mt-0.5">
                          내용: {error.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {warnings.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-5 h-5 bg-[#1e293b] rounded-lg flex items-center justify-center mr-2">
                      <WarningIcon className="text-[#fbbf24]" size="xs" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">경고 ({warnings.length}건)</h4>
                  </div>
                  <div className="space-y-1.5">
                    {warnings.map((warning, index) => (
                      <div key={index} className="p-2.5 bg-[#1e293b] border border-[#f59e0b] rounded-lg">
                        <div className="text-xs font-medium text-[#fcd34d]">
                          {warning.rowNum}행: {warning.reason}
                        </div>
                        <div className="text-xs text-[#fbbf24] mt-0.5">
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
      <div className="bg-[#141923] rounded-lg border border-[#1a1f2e]">
        <div className="px-6 py-4 border-b border-[#1a1f2e]">
          <h3 className="text-base font-semibold text-white">같은 날짜에 같은 지출용도 그룹</h3>
        </div>
        <div className="p-6">
          {groupedExpenses.length > 0 ? (
            <div className="space-y-3">
              {groupedExpenses.map((group, index) => (
                <div key={index} className="bg-[#0f1419] rounded-lg border border-[#1a1f2e] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-[#1e293b] rounded-lg flex items-center justify-center">
                      <CalendarIcon className="text-[#a78bfa]" size="sm" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {group.date} - {group.purpose}
                      </h4>
                      <span className="text-xs text-gray-300">({group.count}건)</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {group.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-2 bg-[#141923] rounded border border-[#1a1f2e]">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-300">
                            순번 {item.순번}: {item.내용}
                          </span>
                          <span className="text-xs text-gray-300 ml-1.5">
                            (사원: {item.사원코드})
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#34d399]">
                          {item.합계.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center mx-auto mb-2">
                <DocumentIcon className="text-gray-500" size="md" />
              </div>
              <p className="text-xs text-gray-300">점심/저녁 지출이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

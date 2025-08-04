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
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                법인카드 지출 내역 검증 시스템
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                엑셀 파일을 업로드하여 법인카드 지출 내역을 검증하세요
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">검증 규칙</div>
                <div className="text-xs text-gray-500">
                  1. 점심/저녁 지출 내용 형식<br />
                  2. 사원코드 일치<br />
                  3. 부가세 0원 검증<br />
                  4. 같은 날짜 그룹화
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 파일 업로드 섹션 */}
          {!data && (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  엑셀 파일 업로드
                </h2>
                <p className="text-gray-600">
                  법인카드 지출 내역이 포함된 엑셀 파일(.xlsx)을 업로드해주세요.
                </p>
              </div>
              <FileUpload onDataLoaded={handleDataLoaded} />
            </div>
          )}

          {/* 검증 결과 섹션 */}
          {validationResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  검증 결과
                </h2>
                <button
                  onClick={() => {
                    setData(null);
                    setValidationResult(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  새 파일 업로드
                </button>
              </div>
              <ValidationResults result={validationResult} />
            </div>
          )}

          {/* 사용법 안내 */}
          {!data && (
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 사용법
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">1. 파일 준비</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 엑셀 파일(.xlsx) 형식</li>
                    <li>• 다음 컬럼이 포함되어야 함:</li>
                    <li className="ml-4">순번, 거래일자, 지출용도, 내용, 거래처, 공급가액, 부가세, 합계, 증빙, 프로젝트, 사원코드</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">2. 검증 규칙</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 점심/저녁 지출: "점심, {사원명}" 형식</li>
                    <li>• 사원코드와 내용의 사원명 일치</li>
                    <li>• 부가세 0원이 아니어야 함</li>
                    <li>• 같은 날짜 지출 그룹화 표시</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>법인카드 지출 내역 검증 시스템</p>
            <p className="mt-1">엑셀 파일을 업로드하여 지출 내역을 검증하세요</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getValidationHistory,
  clearValidationHistory,
  ValidationHistoryItem,
} from '@/lib/validationHistory';
import { downloadExampleText } from '@/lib/exampleData';
import { releases } from '@/lib/releases';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistoryItem?: (item: ValidationHistoryItem) => void;
}

function formatDate(ms: number): string {
  const d = new Date(ms);
  const today = new Date();
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
  if (isToday) {
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SidePanel({
  isOpen,
  onClose,
  onSelectHistoryItem,
}: SidePanelProps) {
  const [history, setHistory] = useState<ValidationHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getValidationHistory());
  }, [isOpen]);

  const handleClearHistory = () => {
    if (typeof window !== 'undefined' && window.confirm('검증 이력을 모두 삭제할까요?')) {
      clearValidationHistory();
      setHistory([]);
    }
  };

  return (
    <>
      {/* 오버레이 - 모바일 */}
      <div
        role="button"
        tabIndex={0}
        aria-label="패널 닫기"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      />

      {/* 패널 */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] sm:w-[300px] bg-[#2f2f2f] border-r border-[#404040] flex flex-col shadow-xl transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#404040]">
          <span className="text-sm font-semibold text-white">메뉴</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="패널 닫기"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="inline-block shrink-0" aria-hidden>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 지금까지의 문서 */}
          <section className="border-b border-[#404040]">
            <div className="px-4 py-2.5 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors text-left"
              >
                지금까지의 문서
              </button>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  전체 삭제
                </button>
              )}
            </div>
            <div className="px-2 pb-3">
              {history.length === 0 ? (
                <p className="px-2 py-4 text-xs text-gray-500">아직 검증한 문서가 없습니다.</p>
              ) : (
                <ul className="space-y-0.5">
                  {history.map((item) => (
                    <li key={item.id}>
                      <div className="flex items-stretch gap-1 rounded-lg hover:bg-white/5 group">
                        <button
                          type="button"
                          onClick={() => onSelectHistoryItem?.(item)}
                          className="flex-1 min-w-0 text-left px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-white truncate flex-1">
                              {item.recordCount}건 검증
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            {item.errorCount > 0 && (
                              <span className="text-red-400">오류 {item.errorCount}</span>
                            )}
                            {item.warningCount > 0 && (
                              <span className="text-amber-400">경고 {item.warningCount}</span>
                            )}
                            {item.errorCount === 0 && item.warningCount === 0 && (
                              <span className="text-emerald-400">정상</span>
                            )}
                          </div>
                        </button>
                        {item.shareUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigator.clipboard.writeText(item.shareUrl!);
                            }}
                            title="링크 복사"
                            className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors self-center"
                            aria-label="링크 복사"
                          >
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="inline-block shrink-0" aria-hidden>
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* 예시문서 */}
          <section className="border-b border-[#404040]">
            <h2 className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              예시문서
            </h2>
            <ul className="px-2 pb-3 space-y-0.5">
              <li>
                <button
                  type="button"
                  onClick={() => downloadExampleText()}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white text-left"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="inline-block shrink-0 text-gray-500" aria-hidden>
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  텍스트 예시 다운로드 (.txt)
                </button>
              </li>
              <li>
                <div className="px-3 py-2.5 text-xs text-gray-500">
                  엑셀은 메인 화면에서 「엑셀 선택」으로 업로드할 수 있습니다. 정산내역.xlsx와 동일한 11개 컬럼 양식을 사용하세요.
                </div>
              </li>
            </ul>
          </section>

          {/* 공지 문서 */}
          <section>
            <h2 className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              공지 문서
            </h2>
            <ul className="px-2 pb-4 space-y-0.5">
              <li>
                <Link
                  href="/releases"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="inline-block shrink-0 text-gray-500" aria-hidden>
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  릴리즈 노트 전체 보기
                </Link>
              </li>
              {releases.slice(0, 3).map((r) => (
                <li key={r.version}>
                  <Link
                    href="/releases"
                    className="block px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="text-sm text-white group-hover:text-white">
                      v{r.version}
                      {r.title && (
                        <span className="text-gray-400 font-normal"> · {r.title}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.date}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </>
  );
}

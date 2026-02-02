'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import ValidationResults from '@/components/ValidationResults';
import SidePanel from '@/components/SidePanel';
import { ExpenseRecord, validateCardExpenses, parseTextData } from '@/lib/validation';
import { addValidationHistory, setShareUrlForLastHistoryItem } from '@/lib/validationHistory';
import { sendCustomEvent } from '@/lib/datadog';
import { PlusIcon } from '@/components/icons';
import { decodePayload } from '@/lib/urlPayload';
import { downloadAsExcel, downloadAsText } from '@/lib/exportData';

function HomeContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [initialText, setInitialText] = useState('');

  // hash(#d=...) 또는 예전 쿼리(?text=...)에서 검증 텍스트 복원 (클라이언트 전용, 431 방지)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.slice(1);
    const match = /^d=(.+)$/.exec(hash);
    if (match) {
      decodePayload(match[1].trim()).then((decoded) => {
        if (decoded) setInitialText(decoded);
      });
      return;
    }
    const q = searchParams.get('text');
    if (q) {
      try {
        setInitialText(decodeURIComponent(q));
      } catch {
        setInitialText('');
      }
    }
  }, [searchParams]);

  const [data, setData] = useState<ExpenseRecord[] | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  // 같은 페이지에서 다른 지금까지의 문서 링크로 이동 시(hash만 변경) → 새로고침 없이 상태만 갱신
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      const match = /^d=(.+)$/.exec(hash);
      if (!match) {
        setInitialText('');
        setData(null);
        setValidationResult(null);
        return;
      }
      decodePayload(match[1].trim()).then((decoded) => {
        if (!decoded) return;
        setInitialText(decoded);
        try {
          const records = parseTextData(decoded);
          const result = validateCardExpenses(records);
          setData(records);
          setValidationResult(result);
        } catch {
          setData(null);
          setValidationResult(null);
        }
      });
    };
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const handleDataLoaded = (loadedData: ExpenseRecord[]) => {
    setData(loadedData);
    const result = validateCardExpenses(loadedData);
    setValidationResult(result);

    addValidationHistory({
      recordCount: loadedData.length,
      errorCount: result.errorCount,
      warningCount: result.warningCount,
      normalCount: result.normalCount,
    });

    // 링크로 직접 들어온 경우에도 이력에 공유 링크 저장 (붙여넣기/업로드 시엔 FileUpload에서 덮어씀)
    if (typeof window !== 'undefined') {
      setShareUrlForLastHistoryItem(window.location.href);
    }

    sendCustomEvent('file_uploaded', {
      recordCount: loadedData.length,
      errorCount: result.errorCount,
      warningCount: result.warningCount,
      normalCount: result.normalCount,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#212121]">
      <SidePanel
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        onSelectHistoryItem={(item) => {
          setSidePanelOpen(false);
          if (item.shareUrl && typeof window !== 'undefined') {
            // hash만 바꿔서 이동 → hashchange로 상태 갱신 (새로고침 없음)
            const url = new URL(item.shareUrl);
            window.location.hash = url.hash || '';
          }
        }}
      />

      <div
        className={`flex flex-col flex-1 min-w-0 transition-[margin] duration-200 ${
          sidePanelOpen ? 'md:ml-[300px]' : ''
        }`}
      >
        {/* 미니멀 헤더 - ChatGPT 스타일 */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidePanelOpen(true)}
            className="p-1.5 -ml-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="메뉴 열기"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="inline-block shrink-0" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-base font-semibold text-white">
            법인카드 지출 내역 검증
          </span>
        </div>
        <div className="flex items-center gap-2">
          {validationResult && (
            <button
              onClick={() => {
                setInitialText('');
                if (typeof window !== 'undefined') {
                  window.history.replaceState(null, '', pathname ?? '/');
                }
                setData(null);
                setValidationResult(null);
                sendCustomEvent('new_file_upload_clicked');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <PlusIcon className="text-current" size="sm" />
              새로 검증
            </button>
          )}
          <Link
            href="/releases"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            릴리즈 노트
          </Link>
        </div>
      </header>

        {/* 메인 - 중앙 정렬 */}
        <main className="flex-1 flex flex-col items-center w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-8">
        {!data ? (
          <>
            {/* 헤드라인 - ChatGPT "What can I help with?" 스타일 */}
            <div className="flex-1 flex flex-col items-center justify-center w-full pt-8 pb-6">
              <h1 className="text-3xl sm:text-4xl font-semibold text-white text-center mb-2">
                무엇을 검증할까요?
              </h1>
              <p className="text-sm text-gray-400 text-center max-w-md">
                엑셀 파일을 선택하거나 지출 내역 텍스트를 붙여넣어 검증하세요
              </p>
            </div>

            {/* 입력 영역 - 하단 고정 느낌의 카드 */}
            <div className="w-full mt-auto">
              <FileUpload
              initialText={initialText}
              onDataLoaded={handleDataLoaded}
              onShareLinkReady={setShareUrlForLastHistoryItem}
            />
            </div>
          </>
        ) : (
          <div className="w-full space-y-6">
            <div className="text-center py-2">
              <h2 className="text-lg font-semibold text-white">검증 결과</h2>
              <p className="text-sm text-gray-400 mt-0.5">입력된 데이터의 검증 결과입니다</p>
              {data && (
                <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? window.location.href : '';
                      if (url) navigator.clipboard.writeText(url);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    링크 복사
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadAsExcel(data)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    엑셀 다운로드
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadAsText(data)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    텍스트 다운로드
                  </button>
                </div>
              )}
            </div>
            <ValidationResults result={validationResult} />
          </div>
        )}
      </main>

        {/* 푸터 - ChatGPT 스타일 미니멀 */}
        <footer className="flex-shrink-0 py-3 px-4 text-center">
          <p className="text-xs text-gray-500">
            법인카드 지출 내역 검증 시스템
            <span className="mx-1.5">·</span>
            <Link href="/releases" className="text-gray-500 hover:text-gray-300 transition-colors">
              릴리즈 노트
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#212121] items-center justify-center">
        <p className="text-gray-400 text-sm">로딩 중...</p>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

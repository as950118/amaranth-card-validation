import Link from 'next/link';
import { releases } from '@/lib/releases';

export const metadata = {
  title: '릴리즈 노트 | 법인카드 지출 내역 검증',
  description: '법인카드 지출 내역 검증 시스템 릴리즈 노트',
};

export default function ReleasesPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <header className="bg-[#0f1419] border-b border-[#1a1f2e]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← 홈
            </Link>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">릴리즈 노트</h1>
          <p className="mt-1 text-sm text-gray-300">
            법인카드 지출 내역 검증 시스템 버전별 변경 사항입니다.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-8">
        <ul className="space-y-10 list-none p-0 m-0">
          {releases.map((release) => (
            <li
              key={release.version}
              className="bg-[#141923] border border-[#1a1f2e] rounded-lg p-6"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-lg font-semibold text-white m-0">
                  v{release.version}
                </h2>
                <span className="text-xs text-gray-500">{release.date}</span>
              </div>
              {release.title && (
                <p className="text-sm text-gray-300 mt-1 mb-4">
                  {release.title}
                </p>
              )}
              <div className="space-y-4">
                {release.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">
                      {section.heading}
                    </h3>
                    <ul className="space-y-1.5 list-disc list-inside text-sm text-gray-400 m-0 pl-0">
                      {section.items.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="bg-[#0f1419] border-t border-[#1a1f2e] mt-12">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-4">
          <div className="text-center text-xs text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">
              법인카드 지출 내역 검증
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

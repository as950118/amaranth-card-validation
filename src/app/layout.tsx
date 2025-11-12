import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DatadogProvider from '@/components/DatadogProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '법인카드 지출 내역 검증 시스템',
  description: '엑셀 파일을 업로드하여 법인카드 지출 내역을 검증하세요',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <DatadogProvider />
        {children}
      </body>
    </html>
  );
} 
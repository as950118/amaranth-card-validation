import type { ExpenseRecord } from '@/lib/validation';
import { serializeRecordsToText } from '@/lib/validation';

const DEFAULT_EXCEL_NAME = '법인카드_지출내역_검증결과.xlsx';
const DEFAULT_TEXT_NAME = '법인카드_지출내역_검증결과.txt';

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** 검증 결과 데이터를 엑셀(.xlsx) 파일로 다운로드 */
export function downloadAsExcel(records: ExpenseRecord[], filename = DEFAULT_EXCEL_NAME): void {
  const XLSX = require('xlsx');
  const ws = XLSX.utils.json_to_sheet(records);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '지출내역');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  triggerDownload(blob, filename);
}

/** 검증 결과 데이터를 탭 구분 텍스트(.txt) 파일로 다운로드 */
export function downloadAsText(records: ExpenseRecord[], filename = DEFAULT_TEXT_NAME): void {
  const text = serializeRecordsToText(records);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  triggerDownload(blob, filename);
}

export interface ExpenseRecord {
  순번: string;
  거래일자: string;
  지출용도: string;
  내용: string;
  거래처: string;
  공급가액: number;
  부가세: number;
  합계: number;
  증빙: string;
  프로젝트: string;
  사원코드: string;
}

export interface ValidationError {
  rowNum: number;
  reason: string;
  content: string;
}

export interface ValidationWarning {
  rowNum: number;
  reason: string;
  content: string;
}

export interface GroupedExpense {
  date: string;
  purpose: string;
  count: number;
  items: ExpenseRecord[];
}

export interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  groupedExpenses: GroupedExpense[];
  totalRows: number;
  errorCount: number;
  warningCount: number;
  normalCount: number;
}

export function validateCardExpenses(data: ExpenseRecord[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // 1. 점심/저녁이면 내용 확인
  for (let idx = 0; idx < data.length; idx++) {
    const row = data[idx];
    const purpose = row.지출용도.trim();
    const content = row.내용.trim();
    const name = row.사원코드.trim();
    
    // 점심/저녁 지출인지 확인
    if (purpose.includes('점심') || purpose.includes('저녁')) {
      const mealType = purpose.includes('점심') ? '점심' : '저녁';
      
      if (!content.includes(mealType)) {
        errors.push({
          rowNum: idx + 2,
          reason: `내용에 '${mealType}'이 포함되지 않음`,
          content: content
        });
      }
      
      if (!content.includes(name)) {
        errors.push({
          rowNum: idx + 2,
          reason: `내용에 사원코드 '${name}'이 포함되지 않음`,
          content: content
        });
      }
      
      // 내용 형식 검증 (점심/저녁, 이름 형식)
      const expectedPattern = `${mealType}, ${name}`;
      if (!content.includes(expectedPattern)) {
        warnings.push({
          rowNum: idx + 2,
          reason: `내용 형식이 예상과 다름 (예상: '${expectedPattern}')`,
          content: content
        });
      }
    }
  }
  
  // 2. 부가세가 0원이 아닌지 확인 (단, 1원인 경우는 허용 - ama.txt에서 확인됨)
  for (let idx = 0; idx < data.length; idx++) {
    const row = data[idx];
    if (row.부가세 === 0) {
      errors.push({
        rowNum: idx + 2,
        reason: '부가세가 0원임',
        content: `내용: ${row.내용}, 부가세: ${row.부가세}`
      });
    }
  }
  
  // 3. 공급가액 + 부가세 = 합계 검증
  for (let idx = 0; idx < data.length; idx++) {
    const row = data[idx];
    const calculatedTotal = row.공급가액 + row.부가세;
    if (Math.abs(calculatedTotal - row.합계) > 1) { // 1원 차이는 허용 (반올림 오차)
      warnings.push({
        rowNum: idx + 2,
        reason: `공급가액 + 부가세 ≠ 합계 (${row.공급가액} + ${row.부가세} ≠ ${row.합계})`,
        content: `계산된 합계: ${calculatedTotal}, 실제 합계: ${row.합계}`
      });
    }
  }
  
  // 4. 날짜 형식 검증
  for (let idx = 0; idx < data.length; idx++) {
    const row = data[idx];
    const dateStr = row.거래일자.trim();
    
    // YYYY.MM.DD 형식 검증
    const datePattern = /^\d{4}\.\d{2}\.\d{2}$/;
    if (!datePattern.test(dateStr)) {
      warnings.push({
        rowNum: idx + 2,
        reason: '날짜 형식이 예상과 다름 (예상: YYYY.MM.DD)',
        content: `날짜: ${dateStr}`
      });
    } else {
      // 유효한 날짜인지 확인
      const [year, month, day] = dateStr.split('.').map(Number);
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        warnings.push({
          rowNum: idx + 2,
          reason: '유효하지 않은 날짜',
          content: `날짜: ${dateStr}`
        });
      }
    }
  }
  
  // 5. 같은 날짜 + 지출용도(점심/저녁) 그룹화 (2개 이상일 때만)
  const mealExpenses = data.filter(row => 
    row.지출용도.includes('점심') || row.지출용도.includes('저녁')
  );
  
  const groupedMap = new Map<string, ExpenseRecord[]>();
  
  mealExpenses.forEach(row => {
    const key = `${row.거래일자}_${row.지출용도}`;
    if (!groupedMap.has(key)) {
      groupedMap.set(key, []);
    }
    groupedMap.get(key)!.push(row);
  });
  
  const groupedExpenses: GroupedExpense[] = [];
  groupedMap.forEach((items, key) => {
    // 2개 이상일 때만 그룹에 포함
    if (items.length >= 2) {
      const [date, purpose] = key.split('_');
      groupedExpenses.push({
        date,
        purpose,
        count: items.length,
        items
      });
    }
  });
  
  // 날짜순으로 정렬
  groupedExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const totalRows = data.length;
  const errorCount = errors.length;
  const warningCount = warnings.length;
  const normalCount = totalRows - errorCount;
  
  return {
    errors,
    warnings,
    groupedExpenses,
    totalRows,
    errorCount,
    warningCount,
    normalCount
  };
}

// 텍스트 파일 파싱 함수
export function parseTextData(content: string): ExpenseRecord[] {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
  const records: ExpenseRecord[] = [];
  
  // 헤더 찾기
  let dataStartIndex = -1;
  let headerFound = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('순번') && line.includes('거래일자') && line.includes('지출용도')) {
      // 헤더 시작 찾음
      headerFound = true;
      dataStartIndex = i + 1;
      break;
    }
  }
  
  if (!headerFound || dataStartIndex === -1) {
    throw new Error('올바른 형식의 텍스트 파일이 아닙니다. 헤더를 찾을 수 없습니다.');
  }
  
  // 데이터 파싱 - 탭으로 구분된 형식 처리
  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // 빈 줄이면 건너뛰기
    if (line === '') {
      continue;
    }
    
    // 탭으로 구분된 필드들을 분리
    const fields = line.split('\t');
    
    // 필드 수가 충분한지 확인 (최소 11개)
    if (fields.length >= 11) {
      try {
        const record: ExpenseRecord = {
          순번: fields[0]?.trim() || '',
          거래일자: fields[1]?.trim() || '',
          지출용도: fields[2]?.trim() || '',
          내용: fields[3]?.trim() || '',
          거래처: fields[4]?.trim() || '',
          공급가액: Number(fields[5]?.replace(/,/g, '') || '0') || 0,
          부가세: Number(fields[6]?.replace(/,/g, '') || '0') || 0,
          합계: Number(fields[7]?.replace(/,/g, '') || '0') || 0,
          증빙: fields[8]?.trim() || '',
          프로젝트: fields[9]?.trim() || '',
          사원코드: fields[10]?.trim() || ''
        };
        
        // 필수 필드 검증
        if (record.순번 && record.거래일자 && record.지출용도) {
          records.push(record);
        }
      } catch (error) {
        console.warn(`Row ${i + 1} 파싱 실패:`, error);
        continue;
      }
    }
  }
  
  if (records.length === 0) {
    throw new Error('파싱된 데이터가 없습니다. 파일 형식을 확인해주세요.');
  }
  
  return records;
}

// 엑셀 파일 파싱 함수
export function parseExcelData(file: File): Promise<ExpenseRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = require('xlsx').read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = require('xlsx').utils.sheet_to_json(worksheet);
        
        // 데이터 변환
        const records: ExpenseRecord[] = jsonData.map((row: any, index: number) => ({
          순번: String(row['순번'] || index + 1),
          거래일자: String(row['거래일자'] || ''),
          지출용도: String(row['지출용도'] || ''),
          내용: String(row['내용'] || ''),
          거래처: String(row['거래처'] || ''),
          공급가액: Number(String(row['공급가액'] || '0').replace(/,/g, '')),
          부가세: Number(String(row['부가세'] || '0').replace(/,/g, '')),
          합계: Number(String(row['합계'] || '0').replace(/,/g, '')),
          증빙: String(row['증빙'] || ''),
          프로젝트: String(row['프로젝트'] || ''),
          사원코드: String(row['사원코드'] || '')
        }));
        
        resolve(records);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsArrayBuffer(file);
  });
}

// 통합 파일 파싱 함수 (파일 타입에 따라 자동 처리)
export function parseFileData(file: File): Promise<ExpenseRecord[]> {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.txt')) {
      // 텍스트 파일 처리
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const records = parseTextData(content);
          resolve(records);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('텍스트 파일 읽기 실패'));
      reader.readAsText(file, 'utf-8');
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // 엑셀 파일 처리
      parseExcelData(file).then(resolve).catch(reject);
    } else {
      reject(new Error('지원하지 않는 파일 형식입니다. .txt, .xlsx, .xls 파일만 지원합니다.'));
    }
  });
} 
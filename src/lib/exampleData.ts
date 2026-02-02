export const EXAMPLE_TEXT = `순번

거래일자

지출용도

내용

거래처

공급가액

부가세

합계

증빙

프로젝트

사원코드

1

2025.07.01

법인카드_식대(점심)

점심, 백승한

프랭크버거 여의도점

11,454

1,146

12,600

신용카드매출전표(법인)

공통(CMP모니터링팀)

백승한

2

2025.07.01

법인카드_식대(저녁)

저녁, 백승한

별미볶음점2호

11,818

1,182

13,000

신용카드매출전표(법인)

공통(CMP모니터링팀)

백승한

3

2025.07.02

법인카드_식대(점심)

점심, 백승한

지에스(GS)25 브라이튼 여의도1호

11,818

1,182

13,000

신용카드매출전표(법인)

공통(CMP모니터링팀)

백승한`;

export function downloadExampleText(): void {
  const blob = new Blob([EXAMPLE_TEXT], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '예시_법인카드_지출내역.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import pandas as pd
import re

def validate_card_expenses(df):
    """
    법인카드 지출 내역을 검증합니다.
    
    검증 규칙:
    1. 지출용도가 점심 혹은 저녁이라면 내용에 "점심, 저녁, {이름}" 으로 기재되어야함
    2. 내용의 {이름}에 해당하는 부분이 사원코드와 일치해야함
    3. 부가세는 0원이 아니어야함
    4. 같은 거래일자에 같은 지출용도(점심, 저녁)이 존재한다면 모아서 보여줘야함
    """
    
    # 필드명 정리 (공백 등 제거)
    df.columns = df.columns.str.strip()
    
    # 결과 저장 리스트
    errors = []
    warnings = []
    
    print("🔍 법인카드 지출 내역 검증을 시작합니다...\n")
    
    # 1. 점심/저녁이면 내용 확인
    print("📋 규칙 1: 지출용도가 점심/저녁인 경우 내용 형식 검증")
    for idx, row in df.iterrows():
        purpose = str(row['지출용도']).strip()
        content = str(row['내용']).strip()
        name = str(row['사원코드']).strip()
        
        # 점심/저녁 지출인지 확인
        if '점심' in purpose or '저녁' in purpose:
            # 내용에 "점심" 또는 "저녁"이 포함되어야 함
            meal_type = "점심" if "점심" in purpose else "저녁"
            
            if meal_type not in content:
                errors.append((idx+2, f"내용에 '{meal_type}'이 포함되지 않음", content))
            
            # 내용에 사원코드(이름)가 포함되어야 함
            if name not in content:
                errors.append((idx+2, f"내용에 사원코드 '{name}'이 포함되지 않음", content))
            
            # 내용 형식 검증 (점심/저녁, 이름 형식)
            expected_pattern = f"{meal_type}, {name}"
            if expected_pattern not in content:
                warnings.append((idx+2, f"내용 형식이 예상과 다름 (예상: '{expected_pattern}')", content))
    
    # 2. 부가세가 0원이 아닌지 확인
    print("\n📋 규칙 2: 부가세 0원 검증")
    df['부가세'] = pd.to_numeric(df['부가세'], errors='coerce').fillna(0)
    for idx, row in df.iterrows():
        if row['부가세'] == 0:
            errors.append((idx+2, "부가세가 0원임", f"내용: {row['내용']}, 부가세: {row['부가세']}"))
    
    # 3. 같은 날짜 + 지출용도(점심/저녁) 그룹화
    print("\n📋 규칙 3: 같은 날짜에 같은 지출용도 그룹화")
    df['거래일자'] = pd.to_datetime(df['거래일자'], errors='coerce')
    
    # 점심/저녁 지출만 필터링
    meal_expenses = df[df['지출용도'].str.contains("점심|저녁", na=False)].copy()
    
    if not meal_expenses.empty:
        grouped = meal_expenses.groupby(['거래일자', '지출용도'])
        
        print("\n📅 같은 날짜에 같은 지출용도 그룹:")
        for (date, purpose), group in grouped:
            if len(group) > 1:
                print(f"\n🔸 {date.strftime('%Y.%m.%d')} - {purpose} ({len(group)}건):")
                for _, row in group.iterrows():
                    print(f"  - 순번 {row['순번']}: {row['내용']} (사원: {row['사원코드']}, 금액: {row['합계']:,}원)")
            else:
                print(f"\n🔸 {date.strftime('%Y.%m.%d')} - {purpose} (1건):")
                row = group.iloc[0]
                print(f"  - 순번 {row['순번']}: {row['내용']} (사원: {row['사원코드']}, 금액: {row['합계']:,}원)")
    else:
        print("점심/저녁 지출이 없습니다.")
    
    # 검증 결과 출력
    print("\n" + "="*50)
    print("📊 검증 결과 요약")
    print("="*50)
    
    if not errors and not warnings:
        print("✅ 모든 항목이 조건을 만족합니다!")
    else:
        if errors:
            print(f"\n❌ 오류 ({len(errors)}건):")
            for row_num, reason, content in errors:
                print(f"  - {row_num}행: {reason}")
                print(f"    내용: {content}")
        
        if warnings:
            print(f"\n⚠️  경고 ({len(warnings)}건):")
            for row_num, reason, content in warnings:
                print(f"  - {row_num}행: {reason}")
                print(f"    내용: {content}")
    
    return errors, warnings

def main():
    """메인 함수"""
    try:
        # 엑셀 파일 불러오기 (target.xlsx가 있으면 사용, 없으면 기본 파일명)
        try:
            df = pd.read_excel("target.xlsx")
            print("✅ target.xlsx 파일을 불러왔습니다.")
        except FileNotFoundError:
            try:
                df = pd.read_excel("your_file.xlsx")
                print("✅ your_file.xlsx 파일을 불러왔습니다.")
            except FileNotFoundError:
                print("❌ 검증할 엑셀 파일을 찾을 수 없습니다.")
                print("   - target.xlsx 또는 your_file.xlsx 파일이 필요합니다.")
                print("   - make_xlsx.py를 사용하여 target.txt를 xlsx로 변환하세요.")
                return
        
        # 검증 실행
        errors, warnings = validate_card_expenses(df)
        
        # 검증 통계
        total_rows = len(df)
        error_count = len(errors)
        warning_count = len(warnings)
        
        print(f"\n📈 통계:")
        print(f"  - 전체 행 수: {total_rows}")
        print(f"  - 오류: {error_count}건")
        print(f"  - 경고: {warning_count}건")
        print(f"  - 정상: {total_rows - error_count}건")
        
    except Exception as e:
        print(f"❌ 검증 중 오류가 발생했습니다: {e}")

if __name__ == "__main__":
    main()

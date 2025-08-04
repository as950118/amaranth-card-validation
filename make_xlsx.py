import sys
import pandas as pd
from io import StringIO

def parse_text_to_dataframe(text_data: str):
    """
    텍스트 데이터를 DataFrame으로 변환합니다.
    
    Parameters:
    - text_data: 탭으로 구분된 텍스트 전체 (헤더 포함)
    
    Returns:
    - pandas.DataFrame: 변환된 데이터프레임
    """
    lines = [line.strip() for line in text_data.strip().split("\n") if line.strip()]
    
    # 열 이름은 처음 11줄
    header = lines[:11]
    rows = []
    
    for i in range(11, len(lines), 11):
        chunk = lines[i:i+11]
        if len(chunk) == 11:
            rows.append(chunk)
    
    df = pd.DataFrame(rows, columns=header)
    
    # 타입 변환
    df["거래일자"] = pd.to_datetime(df["거래일자"], format="%Y.%m.%d", errors="coerce")
    for col in ["공급가액", "부가세", "합계"]:
        df[col] = df[col].astype(str).str.replace(",", "").astype(float)
    
    return df

def save_lunch_dinner_excel(text_data: str, output_filename: str = "식대_지출내역.xlsx"):
    """
    붙여넣은 텍스트 데이터를 Excel(.xlsx)로 저장합니다.

    Parameters:
    - text_data: 탭으로 구분된 텍스트 전체 (헤더 포함)
    - output_filename: 저장할 파일명 (기본값: '식대_지출내역.xlsx')
    """
    df = parse_text_to_dataframe(text_data)
    df.to_excel(output_filename, index=False)
    print(f"✅ {output_filename} 파일이 생성되었습니다.")
    return df

def convert_target_txt_to_xlsx(input_file: str = "target.txt", output_file: str = "target.xlsx"):
    """
    target.txt 파일을 읽어서 xlsx로 변환합니다.
    
    Parameters:
    - input_file: 입력 텍스트 파일명 (기본값: 'target.txt')
    - output_file: 출력 엑셀 파일명 (기본값: 'target.xlsx')
    """
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            text_data = f.read()
        
        df = parse_text_to_dataframe(text_data)
        df.to_excel(output_file, index=False)
        print(f"✅ {input_file}을 {output_file}로 변환했습니다.")
        return df
    except FileNotFoundError:
        print(f"❌ {input_file} 파일을 찾을 수 없습니다.")
        return None
    except Exception as e:
        print(f"❌ 변환 중 오류가 발생했습니다: {e}")
        return None

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "convert":
        # target.txt를 xlsx로 변환
        convert_target_txt_to_xlsx()
    else:
        # 기존 방식: 표준 입력에서 텍스트 받기
        print("여러 줄을 붙여넣고 Ctrl+D (Linux/macOS) 또는 Ctrl+Z + Enter (Windows)로 종료하세요:")
        text = sys.stdin.read()
        
        print("입력된 내용:\n", text)
        save_lunch_dinner_excel(text)
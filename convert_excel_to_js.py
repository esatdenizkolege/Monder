import pandas as pd
import json
import math

EXCEL_FILE = r'C:\Users\ESAT\.gemini\antigravity\scratch\transfer_plan.xlsx'
OUTPUT_FILE = r'C:\Users\ESAT\.gemini\antigravity\scratch\transfer_app\data.js'

import datetime

def format_cell(val):
    if pd.isna(val):
        return ""
    if isinstance(val, pd.Timestamp):
        return val.strftime('%d.%m.%Y %H:%M')
    if isinstance(val, datetime.time):
        return val.strftime('%H:%M')
    return str(val).strip()

def main():
    try:
        df = pd.read_excel(EXCEL_FILE)
        
        # Determine columns
        cols = {
            'ad_soyad': 'AD-SOYAD',
            # 'bolum': 'BÖLÜM',
            'sehir': 'ŞEHİR',
            # 'firma': 'FİRMA',
            'sponsor': 'SPONSOR',
            'arrival_date': 'İSTANBUL İNİŞ TARİH',
            'arrival_time': 'İNİŞ SAAT',
            'departure_date': 'İSTANBUL DAN GİDİŞ TARİH',
            'departure_time': 'GİDİŞ SAAT',
            # 'not': 'NOT' 
        }

        # Handle column names more flexibly if needed
        actual_cols = df.columns.tolist()
        
        # Try to find best match for each key if exact match fails
        mapped_cols = {}
        for key, target in cols.items():
            if target in actual_cols:
                mapped_cols[key] = target
            else:
                # Try partial match
                match = next((c for c in actual_cols if str(target) in str(c)), None)
                if match:
                    mapped_cols[key] = match
                    print(f"Mapped {key} ({target}) -> {match}")
                else:
                    print(f"Warning: Column {target} not found for {key}")

        # Also find 'NOT' or 'NOTLAR'
        notes_col = next((c for c in actual_cols if 'NOT' in str(c)), None)
        if notes_col:
            mapped_cols['notes'] = notes_col

        print("Columns used:", mapped_cols)

        # Build data structure
        sponsors = {}
        
        for idx, row in df.iterrows():
            sponsor_name = str(row.get(mapped_cols.get('sponsor', ''), '')).strip()
            
            # Skip empty or "nan" sponsors
            if not sponsor_name or sponsor_name.lower() == 'nan':
                 continue

            if sponsor_name not in sponsors:
                sponsors[sponsor_name] = []

            doctor = {
                'name': format_cell(row.get(mapped_cols.get('ad_soyad'), '')),
                'city': format_cell(row.get(mapped_cols.get('sehir'), '')),
                'arrival_date': format_cell(row.get(mapped_cols.get('arrival_date'), '')),
                'arrival_time': format_cell(row.get(mapped_cols.get('arrival_time'), '')),
                'departure_date': format_cell(row.get(mapped_cols.get('departure_date'), '')),
                'departure_time': format_cell(row.get(mapped_cols.get('departure_time'), '')),
                'notes': format_cell(row.get(mapped_cols.get('notes'), ''))
            }
            sponsors[sponsor_name].append(doctor)

        # Convert to list of objects for output
        result = []
        for name, docs in sponsors.items():
            # Sort doctors alphabetically
            docs.sort(key=lambda x: x['name'])
            result.append({
                'sponsor': name,
                'doctors': docs
            })
        
        # Sort sponsors alphabetically
        result.sort(key=lambda x: x['sponsor'])

        # Write to JS file
        js_content = f"window.transferData = {json.dumps(result, indent=2, ensure_ascii=False)};"
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print(f"Successfully wrote {len(result)} sponsors to {OUTPUT_FILE}")

    except Exception as e:
        print(f"Error processing Excel: {e}")

if __name__ == "__main__":
    main()

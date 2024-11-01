import FinanceDataReader as fdr
import json
import os
from datetime import datetime

periodic_update_file = os.path.expanduser('~/tnp/public/andy/periodic_update.json')
pud = dict()

def code_desc_current(pr, code, range):
    stock_info = pr[pr['Code'] == code]
    try:
        price = int(stock_info['Close'].values[0])
    except: 
        price = 0
    try:
        high = int(stock_info['High'].values[0])
    except: 
        high = 0
    try:
        low = int(stock_info['Low'].values[0])
    except: 
        low = 0
    try:
        vol = int(stock_info['Volume'].values[0])
    except: 
        vol = 0

    lb, ub = range
    if lb <= price <= ub:
        status = f'price within range ({lb}, {ub})'
    elif price < lb:
        status = f'price LOWER than {lb}: need attention!'
    else:
        status = f'price HIGHER than {ub}: check'

    if ub == 0 or lb == 0: 
        status += f' | low value and/or high value not available'
    else:
        if high >= ub:
            status += f' | high value {high} hit over {ub}'
        if low <= lb:
            status += f' | low value {low} hit under {lb}'

    return status

pr = fdr.StockListing('KRX')
current_time = datetime.now()

# Define stock codes and price ranges
code1 = '011200'  # HMM
code1_range = (16000, 18000)
code2 = '294090'  # 25f
code2_range = (5000, 10000)

# Get statuses
status1 = code_desc_current(pr, code1, code1_range)
status2 = code_desc_current(pr, code2, code2_range)

# Prepare the output data
pud['Gen time'] = current_time.strftime('%Y-%m-%d %H:%M:%S')
pud['# 1'] = "---"
pud['Code 1 status'] = status1
pud['# 2'] = "---"
pud['Code 2 status'] = status2

# Write to JSON file
with open(periodic_update_file, mode='w') as pdf:
    json.dump(pud, pdf, indent=4)

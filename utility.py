import datetime

replace_quotes = lambda a: str(a).replace('\'', '').replace('\"', '')

month_to_string = lambda month: datetime.date(1900, month, 1).strftime('%b')

quarter_months = {1: [1, 2, 3],
                  2: [4, 5, 6],
                  3: [7, 8, 9],
                  4: [10, 11, 12]}

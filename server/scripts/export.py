from users.models import UserProfile, Location
from snaps.models import Branch
from django.contrib.auth.models import User
from snaps.helpers import create_bitsian
from django.db.models import Q
import openpyxl


def export_bitsians():
    branch = Branch.objects.all()
    c = 0
    wb = openpyxl.Workbook()
    for i in branch:
        try:
            ws = wb.worksheets[c]
            ws.title = f"{i.branch_code}"
            colms = Location.objects.filter(branch=i).distinct("row").count()
            ascii = 65
            for j in range(0, colms):
                if j == 0:
                    ws[f"{chr(ascii)}1"] = "Sitting Row"
                else:
                    ws[f"{chr(ascii)}1"] = f"Standing Row {j}"
                ascii += 1
            ascii = 65
            for j in range(0, colms):
                locs = Location.objects.filter(Q(branch=i) & Q(row=j))
                row = 2
                for k in locs:
                    if k.tag:
                        ws[f"{chr(ascii)}{row}"] = f"{k.tag.name}"
                    else:
                        ws[f"{chr(ascii)}{row}"] = ""
                    row += 1
                ascii += 1
        except Exception as e:
            print(e)
        c += 1
    wb.save("Exported_excel.xlsx")
    wb.close()


def run():
    export_bitsians()

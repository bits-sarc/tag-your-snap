from users.models import UserProfile, Location
from snaps.models import Branch
from django.contrib.auth.models import User
from snaps.helpers import create_bitsian
from django.db.models import Q
import openpyxl


def export_bitsians():
    branches = Branch.objects.all()
    c = 0
    wb = openpyxl.Workbook()
    for i in branches:
        try:
            ws = wb.create_sheet(title=f"{i.branch_code}", index=c)
            ws = wb.worksheets[c]
            c += 1
            colms = Location.objects.filter(branch=i).distinct("row").count()
            ascii = 65
            for j in range(0, colms):
                if j == 0:
                    ws[f"{chr(ascii)}1"] = "Sitting Row"
                else:
                    ws[f"{chr(ascii)}1"] = f"Standing Row {j}"
                ascii += 1
            ascii = 65
            for l in range(0, colms):
                locs = Location.objects.filter(Q(branch=i) & Q(row=l)).order_by("x")
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

    wb.save("Exported_excel.xlsx")
    wb.close()


def run():
    export_bitsians()

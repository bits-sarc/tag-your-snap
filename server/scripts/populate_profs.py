from users.models import *
from snaps.models import *
import openpyxl
import random

depts = {
    "CSIS": ["A7", "BXA7", "H112", "H103"],
    "Civil": ["H130", "H155", "H143", "H144", "A2", "BXA2"],
    "Bio": ["H129", "B1"],
    "Chemistry": ["B2"],
    "Eco": ["B3"],
    "Math": ["B4"],
    "Phy": ["B5"],
    "EEE": ["H140", "H123", "H124", "A3", "BXA3", "BXA8", "BXAA", "AA", "A8"],
    "Pharma": ["H146", "H147", "H153", "A5"],
    "Chemical": ["H101", "A1", "BXA1"],
    "Mech": ["A4", "BXA4", "H106", "H141", "AB", "BXAB", "H142"],
    "Humanities": ["D2"],
    "Management": ["H154"]
}

workbook = openpyxl.load_workbook('professors.xlsx')
sheet = workbook.active

profs_data = {}
current_dept = None

for row in sheet.iter_rows(values_only=True):
    if row[0] in depts.keys() and current_dept == None:
        current_dept = row[0]
        profs_data[current_dept] = []
        continue
    
    if row[0] == "" or row[0] is None:
        current_dept = None
        continue

    profs_data[current_dept].append(row[0])

for dept in profs_data.keys():
    branches = depts[dept]

    for prof in profs_data[dept]:
        for branch_code in branches:
            username = "".join(prof.split(" "))
            user = User.objects.create(username=username)
            branch = Branch.objects.get(branch_code=branch_code)
            UserProfile.objects.create(user=user, name=prof, branch=branch, is_prof=True)
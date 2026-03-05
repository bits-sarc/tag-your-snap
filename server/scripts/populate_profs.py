from users.models import *
from snaps.models import *
import openpyxl
import random

def run():

    depts = {
    "CSIS": ["A7", "BXA7", "H112", "H103", "PHXF/P", "UBA7"],
    "Civil": ["H130", "H155", "H143", "H144", "A2", "BXA2", "A2RM", "PHXF/P"],
    "Bio": ["H129", "B1", "PHXF/P"],
    "Chemistry": ["B2", "PHXF/P"],
    "Eco": ["B3", "PHXF/P"],
    "Math": ["B4", "PHXF/P"],
    "Phy": ["B5", "PHXF/P"],
    "EEE": [
        "H140", "H123", "H124", "H131",
        "A3", "BXA3", "BXA8", "BXAA",
        "AA", "A8", "AAIS", "A3UB",
        "PHXF/P"],
    "Pharma": ["H146", "H147", "H153", "A5", "PHXF/P"],
    "Chemical": ["H101", "A1", "BXA1", "PHXF/P"],
    "Mech": [
        "A4", "BXA4", "A4RM",
        "H106", "H141",
        "AB", "BXAB", "H142",
        "PHXF/P"],
    "Humanities": ["D2", "PHXF/P"],
    "Management": ["H154", "PHXF/P"],
    "RMIT": ["RMIT", "A4RM", "A2RM"]
}

    workbook = openpyxl.load_workbook('scripts/professors.xlsx')
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
            prof = prof.replace(",", "")
            if not "Prof." in prof:
                if "Dr." in prof:
                    prof = prof.replace("Dr.", "Prof.")
                else:
                    prof = "Prof. " + prof
            prof = prof.replace("PhD", "")
            for branch_code in branches:
                username = "".join(prof.split(" ")) + branch_code
                user = User.objects.create(username=username)
                branch = Branch.objects.get(branch_code=branch_code)
                UserProfile.objects.create(user=user, name=prof, branch=branch, is_prof=True)

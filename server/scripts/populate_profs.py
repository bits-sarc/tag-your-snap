from users.models import *
from snaps.models import *
from django.contrib.auth.models import User
import openpyxl
import random

def run():
    depts = {
    "CSIS": [
        "A7", "BXA7", "H112", "H103", "A7UB",
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Civil": [
        "H130", "H155", "H143", "H144", "A2", "BXA2", "A2RM", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Bio": [
        "H129", "B1", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Chemistry": [
        "B2", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Eco": [
        "B3", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Math": [
        "B4", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Phy": [
        "B5", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "EEE": [
        "H140", "H123", "H124", "H131",
        "A3", "BXA3", "BXA8", "BXAA",
        "AA", "A8", "AAIS", "A3UB",
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Pharma": [
        "H146", "H147", "H153", "A5", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Chemical": [
        "H101", "A1", "BXA1", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Mech": [
        "A4", "BXA4", "A4RM",
        "H106", "H141",
        "AB", "BXAB", "H142",
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Humanities": [
        "D2", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "Management": [
        "H154", 
        "PHXF", "PHXP", "PHOF", "PHDF", "PHRF", "PHDP", "PHRP"
    ],
    "RMIT": [
        "RMIT", "A4RM", "A2RM"
    ]
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
                
                # Use get_or_create for Branch (smart fallback)
                branch, _ = Branch.objects.get_or_create(
                    branch_code=branch_code, 
                    defaults={'branch_name': branch_code}
                )

                # Use get_or_create for User (skips existing)
                user, created = User.objects.get_or_create(username=username)
                
                # Use get_or_create for Profile
                UserProfile.objects.get_or_create(
                    user=user, 
                    defaults={'name': prof, 'branch': branch, 'is_prof': True}
                )

if __name__ == "__main__":
    run()

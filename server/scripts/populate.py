from users.models import UserProfile
from snaps.models import Branch
from django.contrib.auth.models import User
from snaps.helpers import create_bitsian
from openpyxl import load_workbook

branch_full_names = {
    "A1": "Chemical Engineering",
    "A2": "Civil Engineering",
    "A3": "Electrical & Electronics Engineering",
    "A4": "Mechanical Engineering",
    "A5": "Pharmacy",
    "A7": "Computer Science",
    "A8": "Electronics & Instrumentation Engineering",
    "AA": "Electronics & Communication Engineering",
    "AB": "Manufacturing Engineering",
    "BXA1": "Dua; Chemical Engineering",
    "BXA2": "Dual Civil Engineering",
    "BXA3": "Dual Electrical & Electronics Engineering",
    "BXA4": "Dual Mechanical Engineering",
    "BXA7": "Dual Computer Science",
    "BXA8": "Dual Electronics & Instrumentation Engineering",
    "BXAA": "Dual Electronics & Communication Engineering",
    "BXAB": "Dual Manufacturing Engineering",
    "B1": "MSc. Biological Sciences",
    "B2": "MSc. Chemistry",
    "B3": "MSc. Economics",
    "B4": "MSc. Mathematics",
    "B5": "MSc. Physics",
    "RMIT": "RMIT Collaboration Programme",
}

def populate_bitsians():
    wb = load_workbook("scripts/mess_list.xlsx")
    ws = wb["Sheet1"]
    for i in range(2, ws.max_row + 1):
        bits_id = ws.cell(row=i, column=2).value
        user_type = bits_id[4]
        prefix = ""
        branch_name = ""
        if user_type == "P":
            continue
        elif user_type == "H":
            prefix = "h"
            branch_name = bits_id[4:8]
            if bits_id[:4] != "2024":
                continue
        else:
            prefix = "f"
            if bits_id[:4] == "2022":
                branch_name = bits_id[4:6]
            elif bits_id[:4] == "2021" and (bits_id[4] == "B"):
                if bits_id[6] == "P" or bits_id[6] == "T":
                    continue
                branch_name = f"BX{bits_id[6:8]}"
            elif bits_id[:4] == "2023" and bits_id[7:9] == "CP":
                branch_name = "RMIT"
            else:
                continue
        username = ws.cell(row=i, column=3).value
        email = f"{prefix}{bits_id[:4]}{bits_id[len(bits_id)-4:len(bits_id)]}@pilani.bits-pilani.ac.in"
        try:
            user = create_bitsian(
                username=f"{prefix}{bits_id[:4]}{bits_id[len(bits_id)-4:len(bits_id)]}",
                email=email,
                bits_id=bits_id,
                name=username,
                branch_name=branch_full_names[branch_name],
                branch_code=branch_name,
            )
            print(f"{i} : {user}")
        except Exception as e:
            print(f"{i} : {e}")


def run():
    populate_bitsians()

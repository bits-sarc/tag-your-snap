from password_generator import PasswordGenerator
from users.models import UserProfile
from snaps.models import Branch
from django.contrib.auth.models import User
from django.db import transaction

pwo = PasswordGenerator()
pwo.maxlen = 20


def create_bitsian(
    username, email, bits_id, name, branch_name, branch_code, is_prof=False
):
    with transaction.atomic():
        try:
            user = User.objects.create(username=username, email=email)
            user.set_password(pwo.generate())
            user.save()
            branch = Branch.objects.get_or_create(
                branch_name=branch_name, branch_code=branch_code
            )[0]
            userprofile = UserProfile.objects.create(
                user=user, name=name, bits_id=bits_id, branch=branch, is_prof=is_prof
            )
            return userprofile
        except Exception as e:
            print(e)
            print(
                f"User with Username:{username},bits_id:{bits_id} could not be created"
            )

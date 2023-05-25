from enum import IntEnum


class batch_id(IntEnum):
    NONE = 0
    A1 = 1
    A2 = 2
    A3 = 3
    A4 = 4
    A5 = 5
    A7 = 6
    A8 = 7
    AA = 8
    AB = 9
    B1 = 10
    B2 = 11
    B3 = 12
    B4 = 13
    B5 = 14
    BXA1 = 15
    BXA2 = 16
    BXA3 = 17
    BXA4 = 18
    BXA5 = 19
    BXA7 = 20
    BXA8 = 21
    BXAA = 22
    BXAB = 23

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

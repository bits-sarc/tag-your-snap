export interface Branch {
    branch_code: string;
    branch_name: string;
    snap_image: string;
    is_done?: boolean;
}

export interface Student {
    id: number;
    name: string;
    bits_id: string;
}

export interface LocationData {
    fakeId?: number;
    id?: number;
    locked: boolean;
    x: number;
    y: number;
    row: number;
    tag: Student | null;
}

export interface BranchDetail extends Branch {
    locations: LocationData[];
    students: Student[];
}

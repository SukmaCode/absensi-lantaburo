export interface CalonSiswaUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    status: string;
    createdAt: string;
}

export interface CalonSiswaStudentInfo {
    nis: string;
    gender: string;
}

export interface CalonSiswaRegistrationPayment {
    orderId: string;
    amount: number;
    formattedAmount: string;
    status: string;
    isPaid: boolean;
    isPending: boolean;
    paymentType: string | null;
    snapToken: string | null;
    createdAt: string | null;
    settlementTime: string | null;
}

export interface CalonSiswaSchoolContact {
    name: string;
    phone: string;
    email: string;
    address: string;
}

export interface CalonSiswaDashboardProps {
    user: CalonSiswaUser;
    studentInfo: CalonSiswaStudentInfo;
    registrationPayment: CalonSiswaRegistrationPayment | null;
    registrationFee: number;
    formattedRegistrationFee: string;
    schoolContact: CalonSiswaSchoolContact;
    autoOpenSnap?: boolean;
}

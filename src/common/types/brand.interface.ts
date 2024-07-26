export interface IBrand {
    id: number;
    name: string;
    logo: string;
    created_at: string;
    updated_at: string;
}

export interface IBrandEdit {
    name: string;
    logo: string;
    updated_at: string;
}

export interface IBrandCreate {
    name: string;
    logo: string;
    create_at: string;
    updated_at: string;
}

export interface IBrandReq {
    name?: string;
    limit?: number;
    page?: number;
}
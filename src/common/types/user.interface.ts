export interface Iuser {
    id ?: number;
    username?: string;
    email : string;
    password : string;
    image : {file : File};
    phone : string;
    address_line1 : string;
    address_line2 : string;
    country : string;
    district : string;
    city : string;
    role_id : number | string;
    is_active: number;
    is_virtual: number;
}
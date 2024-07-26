import { IProduct } from "./product.interface"
export interface IDetail {
    id : number;
    category_id : number;
    name : string;
    deleted_at : null | string;
    created_at : string;
    updated_at : string;
    attributes ?: {
       id : string;
       detail_id : number;
       name : string;
       deleted_at : null | string;
       created_at : string;
       updated_at : string;
    }[];
}

export interface ICategory {
  id?: string
  name: string
  parent_id?: string | number
  image ?: string
  public_id : string;
  is_active : string | number;
  deleted_at : string | null;
  created_at : string;
  updated_at : string;
  detail ?: IDetail[];
}

export interface IPostCategory {
  id?: string
  name: string
  slug?: string
}

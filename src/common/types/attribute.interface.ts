import { IValueAttribute } from "./valueAttribute.interface";

export interface IAttribute {
    id ?: number;
    name : string;
    description : string;
    value_attributes ?: IValueAttribute[];
}
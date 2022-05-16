export interface IUserCreateDto {
    name: string;
    dept_name: string;
    groupid: number;
}

export interface IUserUpdateDto {
    id: string;
    phone: string;
    name: string;
    dept_name: string;
    groupid: number;
    english_name: string;
}
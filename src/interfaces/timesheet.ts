export interface ISheetTemplate {
    frontend: string;
    backend: string;
    test: string;
}

export interface ITimeSheetData {
    name: string;
    value?: string;
    groupid: number;
}
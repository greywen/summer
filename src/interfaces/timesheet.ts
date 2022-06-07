export interface ISheetTemplate {
  frontend: string;
  backend: string;
  test: string;
}

export interface ITimeSheetData {
  userid: string;
  name: string;
  value?: string;
  groupid: number;
}

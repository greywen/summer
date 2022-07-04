export interface ISheetTemplate {
  frontend: string;
  backend: string;
  test: string;
}

export interface ITimeSheet {
  userid: string;
  name: string;
  value?: string;
  groupid: number;
  updateTime: string;
  createTime: string;
}

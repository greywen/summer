export interface IAttendanceUpdateDto {
  date: string;
  day: number;
  name: string;
}

export interface IAttendanceCustomUpdateDto {
  userId: string;
  index: number;
  datas: any[];
}

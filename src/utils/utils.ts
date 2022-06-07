import * as moment from 'moment';
import { AttendanceState } from '../constants';

/**
 * 简单数组去重 eg: [1,2,2]=>[1,2] / ["1","2","2"]=>["1","2"]
 * */
export function unique<T>(arr) {
  return <T[]>Array.from(new Set(arr));
}

export function vacationToEnum(name) {
  switch (name) {
    case '调休':
    case '年假':
      return AttendanceState.C;
    case '休假':
      return AttendanceState.V;
    case '事假':
      return AttendanceState.P;
    case '病假':
      return AttendanceState.S;
    default:
      return AttendanceState.P;
  }
}

export function formatDate(
  date?: moment.Moment | number | string,
  format = 'YYYY-MM-DD',
) {
  if (!date) {
    date = moment();
  }
  if (typeof date === 'number' || typeof date === 'string') {
    date = moment(date);
  }
  return date.format(format);
}

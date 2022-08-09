import * as moment from 'moment';
import { AttendanceState } from '../constants/dingTalk';

/**
 * 简单数组去重 eg: [1,2,2]=>[1,2] / ["1","2","2"]=>["1","2"]
 * */
export function unique<T>(arr) {
  return <T[]>Array.from(new Set(arr));
}
/**
 * 简单数据取交集
 */
export function intersect(arr1: any[], arr2: any[]) {
  return arr1.filter(Set.prototype.has, new Set(arr2));
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

export function now(format = 'YYYY-MM-DD HH:mm:ss') {
  return moment().format(format);
}

const timeSleep = (time: number): Promise<null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
};

/**
 *
 * @param second 等待秒数
 * @returns
 */
export const sleep = (second: number) => {
  return timeSleep(second * 1000);
};

export const matchCaseResult = (key: string, value: string) => {
  const matchList = value.match(new RegExp(`${key}: (.+?)\n`));
  if (matchList?.length > 1) return matchList[1];
  return null;
};

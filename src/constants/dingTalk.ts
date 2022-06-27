/**
 * percent_day：天
 * percent_hour：小时
 */
export enum LeaveDurationUnitType {
  percent_day,
  percent_hour,
}

/**
 * 正常 O 1
 * 调休 C 2
 * 休假 V 3
 * 事假 P 4
 * 病假 S 5
 * 未提交日志 X 6
 * 加班 J 7
 * 迟到 L 8
 */
export enum AttendanceState {
  'O' = 1,
  'C' = 2,
  'V' = 3,
  'P' = 4,
  'S' = 5,
  'X' = 6,
  'J' = 7,
  'L' = 8,
}

export enum AttendanceCheckType {
  'OnDuty' = 'OnDuty', // 上班
  'OffDuty' = 'OffDuty', // 下班
}

export enum TimeResultType {
  'Normal' = 'Normal', //正常
  'Late' = 'Late', // 迟到
  'Early' = 'Early', // 早退
}

export enum GroupId {
  'back-end' = 1,
  'frond-end' = 2,
  'test' = 3,
  'nodejs' = 4,
}

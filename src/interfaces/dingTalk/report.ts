import { IDingTalkBaseResult } from './base';

export interface IReportResult {
  create_time: number;
  creator_id: string;
  creator_name: string;
}

export type IReportSimpleListResult = IDingTalkBaseResult<IReportSimple>;

export interface IReportSimple {
  data_list: IReportSimpleDatalist[];
  has_more: boolean;
  next_cursor: number;
  size: number;
}

export interface IReportSimpleDatalist {
  create_time: number;
  creator_id: string;
  creator_name: string;
  dept_name: string;
  remark: string;
  report_id: string;
  template_name: string;
}

export interface ICreateReport {
  contents: Content[];
  dd_from: string;
  template_id: string;
  userid: string;
  to_chat: boolean;
  to_cids?: string[];
  to_userids?: string[];
}

interface Content {
  content_type: string;
  sort: string;
  type: string;
  content: string;
  key: string;
}

export interface IReportTemplate {
  template_name: string;
  userid: string;
}

interface IGetReportTemplateResult {
  default_received_convs: Defaultreceivedconv[];
  default_receivers: Defaultreceiver[];
  fields: Field[];
  id: string;
  name: string;
  user_name: string;
  userid: string;
}

interface Field {
  field_name: string;
  sort: number;
  type: number;
}

interface Defaultreceiver {
  user_name: string;
  userid: string;
}

interface Defaultreceivedconv {
  conversation_id: string;
  title: string;
}

export type IReportTemplateResult =
  IDingTalkBaseResult<IGetReportTemplateResult>;

export interface IGetReportSimplelistParams {
  cursor: number;
  size: number;
  start_time: number;
  end_time: number;
  template_name: string;
  userid: string;
}

interface IGetReportSimplelistResultData {
  data_list: Datalist[];
  has_more: boolean;
  next_cursor: number;
  size: number;
}

interface Datalist {
  create_time: number;
  creator_id: string;
  creator_name: string;
  dept_name: string;
  remark: string;
  report_id: string;
  template_name: string;
}

export type IGetReportSimplelistResult =
  IDingTalkBaseResult<IGetReportSimplelistResultData>;

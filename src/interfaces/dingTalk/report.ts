import { IDingTalkBaseResult } from "./base";

export interface IReportResult {
    create_time: number;
    creator_id: string;
    creator_name: string;
}

export interface IReportSimpleListResult extends IDingTalkBaseResult<IReportSimple> { }

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
    to_cids: string;
    to_userids: string[];
}

interface Content {
    content_type: string;
    sort: string;
    type: string;
    content: string;
    key: string;
}
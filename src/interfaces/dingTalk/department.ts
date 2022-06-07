import { IDingTalkBaseResult } from './base';

export interface DeptDetail {
  chain: string;
  contact_type: string;
  dept_id: number;
  dept_type: string;
  feature: string;
  name: string;
  nick: string;
}

export type IDepartmentResult = IDingTalkBaseResult<IDepartmentListsub[]>;

export interface IDepartmentListsub {
  auto_add_user: boolean;
  create_dept_group: boolean;
  dept_id: string;
  name: string;
  parent_id: number;
}

export type IDepartmentIdResult = IDingTalkBaseResult<IDepartmentListsubId>;

interface IDepartmentListsubId {
  dept_id_list: string[];
}

export interface IDepartments {
  id: number;
  name: string;
  code: string;
  groups: IDepartmentGroup[];
}

interface IDepartmentGroup {
  id: number;
  name: string;
}

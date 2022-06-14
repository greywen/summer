export interface IGetReportTemplateByNameDto {
  name: string;
}

export interface ICreateReportDto {
  taskDescription?: string;
  taskStatus: string;
  taketime: number;
}

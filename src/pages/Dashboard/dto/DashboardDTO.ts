export interface IGroupDTO {
  categories: string[];
}
export interface IRequestDashboard {
  start_date: string;
  end_date: string;
  /** each group of categories will be a line in the chart */
  groups: IGroupDTO[];
  division_split?: number;
  all_sales: boolean;
}
export interface IResponseDashboard {
  categories: string[];
  datas: {
    date: Date;
    quantity: number;
  }[];
  color?: string;
}
export interface IData {
    quantity: number;
    date: Date;
  }
  
  export interface IGroupData {
    name: string;
    color?: string;
    datas: IData[];
  }
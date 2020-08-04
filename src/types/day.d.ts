declare namespace IDay {
  export interface Item {
    id: number;
    dateTime: string; // 2017-08-08
    todaySleep: number;
    wakeTime: string;
    sleepTime: string;
    user: IUser.Item;
  }
}

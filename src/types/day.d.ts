declare namespace IDay {
  export interface Item {
    id: number;
    dateTime: string; // 2017-08-08
    sleepTime?: string;
    wakeUpTime?: string;
    bedTime?: string;
    user: IUser.Item;
  }
}

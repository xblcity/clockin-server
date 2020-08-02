declare namespace IDay {
  export interface Item {
    id: number;
    value: string; // 2017-08-08
    sleepTime: number;
    user: IUser.Item;
    wake: IWake.Item;
    sleep: ISleep.Item;
  }
}

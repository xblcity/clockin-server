declare namespace IWake {
  export interface Item {
    id: number;
    value: string;
    user: IUser.Item;
    day: IDay.Item;
  }
}

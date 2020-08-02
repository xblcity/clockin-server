// declare namespace IUser {
//   export interface Item {
//     id: number;
//     openid: string;
//     // wake list，获取某段时间用户的起床历史折线
//     wakes: IWake.Item[];
//     // sleep list，获取某段时间用户的睡觉历史折线
//     sleeps: ISleep.Item[];
//     // all days list。获取用户当月打卡记录-日历
//     // sleepTime 获取用户睡眠时间记录
//     days: IDay.Item[];

//     // 平均早睡，平均早起，平均睡眠
//     // 最早早睡，最早早起
//   }
// }

export as namespace IUser

export interface Item {
  id: number;
  openid: string;
  // wake list，获取某段时间用户的起床历史折线
  wakes: IWake.Item[];
  // sleep list，获取某段时间用户的睡觉历史折线
  sleeps: ISleep.Item[];
  // all days list。获取用户当月打卡记录-日历
  // sleepTime 获取用户睡眠时间记录
  days: IDay.Item[];
}

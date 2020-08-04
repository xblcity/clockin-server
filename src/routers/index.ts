import UserController from "../controllers/user";
import TimeController from "../controllers/time";

export interface RouteItem {
  path: string;
  method: "get" | "post" | "put" | "delete";
  action: any;
}

export const AppRoutes: RouteItem[] = [
  {
    path: "/api/wxLogin",
    method: "post",
    action: UserController.wxLogin,
  },
  {
    path: "/api/listUser",
    method: "get",
    action: UserController.listUser,
  },
  {
    path: "/api/showUserDetail",
    method: "get",
    action: UserController.showUserDetail,
  },
  {
    path: "/api/deleteUser",
    method: "post",
    action: UserController.deleteUser,
  },
  {
    path: "/api/postWakeTime",
    method: "post",
    action: TimeController.postWakeTime,
  },
  {
    path: "/api/postSleepTime",
    method: "post",
    action: TimeController.postSleepTime,
  },
  {
    path: "/api/postDayList",
    method: "post",
    action: TimeController.postDayList,
  },
  {
    path: "/api/postTimeList",
    method: "post",
    action: TimeController.postTimeList,
  },
  {
    path: "/api/postTimeExtreme",
    method: "post",
    action: TimeController.postTimeExtreme,
  },
];

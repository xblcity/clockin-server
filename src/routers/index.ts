import UserController from "../controllers/user";
import TimeController from "../controllers/time";

export interface RouteItem {
  path: string;
  method: "get" | "post" | "put" | "delete";
  action: any;
}

export const AppRoutes: RouteItem[] = [
  {
    path: "/wxLogin",
    method: "post",
    action: UserController.wxLogin,
  },
  {
    path: "/listUser",
    method: "get",
    action: UserController.listUser,
  },
  {
    path: "/deleteUser",
    method: "post",
    action: UserController.deleteUser,
  },
  {
    path: "/postTime",
    method: "post",
    action: TimeController.postTime,
  },
  {
    path: "/postDayList",
    method: "post",
    action: TimeController.postDayList,
  },
  {
    path: "/postTimeExtreme",
    method: "post",
    action: TimeController.postTimeExtreme,
  },
];

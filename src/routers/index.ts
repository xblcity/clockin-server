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
    path: "/api/deleteUser",
    method: "post",
    action: UserController.deleteUser,
  },
  {
    path: "/api/postTime",
    method: "post",
    action: TimeController.postTime,
  },
  {
    path: "/api/postDayList",
    method: "post",
    action: TimeController.postDayList,
  },
  {
    path: "/api/postTimeExtreme",
    method: "post",
    action: TimeController.postTimeExtreme,
  },
];

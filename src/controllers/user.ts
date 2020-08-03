import { Context } from "koa";
import { getManager } from "typeorm";
import rp from "request-promise";
import { wxConfig } from "../config";

import { User } from "../entity/user";

class UserController {
  // 登录 || 注册
  public static async wxLogin(ctx: Context) {
    const { code } = ctx.request.body;
    if (!code) {
      ctx.status = 400;
      ctx.body = "缺少code参数";
      return;
    }
    const url = `${wxConfig.url}?appid=${wxConfig.appid}&secret=${wxConfig.secret}&js_code=${code}&grant_type=authorization_code`;
    await rp(url)
      .then(async (response) => {
        // const res = JSON.parse(response);
        const res = { openid: "76869958786843", errcode: null, errmsg: null };
        const { errcode, errmsg, openid } = res;
        if (errcode || errmsg) {
          ctx.status = 400;
          ctx.body = {
            errcode,
            errmsg,
          };
          return;
        }
        const userRepository = getManager().getRepository(User);
        // 获取到openid，查询当前数据库是否存在此用户
        const targetUser = await userRepository.findOne({
          where: { openid },
          relations: ["wakes"],
        });
        if (targetUser) {
          ctx.status = 200;
          ctx.body = {
            userId: targetUser.id,
          };
          return;
        }
        // 新用户注册
        const newUser = userRepository.create({
          openid,
        });
        userRepository.save(newUser);
        ctx.status = 200;
        ctx.body = "注册成功";
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // 获取用户列表
  public static async listUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();

    ctx.status = 200;
    ctx.body = users;
  }

  // 获取某个用户数据
  public static async showUserDetail(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(ctx.query.id);

    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      ctx.status = 404;
    }
  }

  // 删除用户
  public static async deleteUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    await userRepository.delete(ctx.query.id);

    ctx.status = 204;
  }
}

export default UserController;

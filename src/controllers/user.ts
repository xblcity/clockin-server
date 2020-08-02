import { Context } from "koa";
import { getManager } from "typeorm";
import rp from "request-promise";
import { wxConfig } from "../config";

import { User } from "../entity/user";

class UserController {
  public static async wxLogin(ctx: Context) {
    const { code } = ctx.request.body;
    if (!code) {
      ctx.status = 400;
      ctx.body = "缺少code参数";
      return;
    }
    // const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxConfig.appid}&secret=${wxConfig.secret}&js_code=${code}&grant_type=authorization_code`;
    // await rp(url)
    //   .then((response) => {
    //     const res = JSON.parse(response);
    //     const { errcode, errmsg, openid } = res;
    //     if (errcode || errmsg) {
    //       ctx.status = 400;
    //       ctx.body = {
    //         errcode,
    //         errmsg,
    //       };
    //       return;
    //     }
    //     ctx.status = 200;
    //     ctx.body = {
    //       openid,
    //     };
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });

      // 写入数据库
      const userRepository = getManager().getRepository(User);

      const newUser = userRepository.create({
        openid: "123123",
      });
      userRepository.save(newUser);
      ctx.body = "注册成功";
  }

  public static async listUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();

    ctx.status = 200;
    ctx.body = users;
  }

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

  public static async deleteUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    await userRepository.delete(ctx.query.id);

    ctx.status = 204;
  }
}

export default UserController;

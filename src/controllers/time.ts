import { Context } from "koa";
import { getManager } from "typeorm";

import { User, Wake, Day } from "../entity/index";

class TimeController {
  public static async postWakeTime(ctx: Context) {
    const { userId, dateTime, value } = ctx.request.body;
    const userRepository = getManager().getRepository(User);
    const wakeRepository = getManager().getRepository(Wake);
    const dayRepository = getManager().getRepository(Day);

    // 查询目标用户
    const targetUser = await userRepository.findOne({
      where: { id: userId },
      relations: ["wakes"],
    });

    console.log(targetUser);

    // 查询目标日期
    const targetDay = await dayRepository.findOne({
      value: dateTime,
    });

    console.log(targetDay);

    // 创建 wakeTime 并存储
    const newWakeTime = wakeRepository.create({
      value,
    });
    await wakeRepository.save(newWakeTime);

    // 存储到目标用户中
    targetUser.wakes = [...targetUser.wakes, newWakeTime];
    await userRepository.save(targetUser);

    // 判断day是否存在，并存储到day中
    if (!!targetDay) {
      targetDay.wake = value;
      await userRepository.save(targetDay);
    } else {
      // 查找当前, 创建时要存储wakeTime实例 
      const newDay = dayRepository.create({
        wake: newWakeTime,
        value: dateTime,
      });
      await dayRepository.save(newDay);
    }
  }

  public static async postSleepTime(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();

    ctx.status = 200;
    ctx.body = users;
  }

  public static async getWakeTimeList(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(ctx.query.id);

    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      ctx.status = 404;
    }
  }

  public getEarliestTime(ctx: Context) {}

  public static async getSleepAmount(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    await userRepository.delete(ctx.query.id);
    // 当前区间范围，平均睡眠时间，

    ctx.status = 204;
  }
}

export default TimeController;

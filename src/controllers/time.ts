import { Context } from "koa";
import { getManager } from "typeorm";

import { User, Wake, Sleep, Day } from "../entity/index";

class TimeController {
  public static async postWakeTime(ctx: Context) {
    const { userId, dateTime, value } = ctx.request.body;
    const userRepository = getManager().getRepository(User);
    const wakeRepository = getManager().getRepository(Wake);
    const dayRepository = getManager().getRepository(Day);

    // 查询目标用户, where是条件，relations-关系需要加载
    const targetUser = await userRepository.findOne({
      where: { id: userId },
      relations: ["wakes", "days"],
    });

    if (!targetUser) {
      ctx.status = 401;
      ctx.body = {
        status: false,
        errMsg: "用户不存在",
      };
      return;
    }

    // 查询目标日期
    const targetDay = await dayRepository.findOne({
      where: {value: dateTime},
      relations: ["wake"],
    });

    console.log(targetDay);

    // targetDay不存在需要创建一个
    if (!targetDay) {
      // 创建 wakeTime 并存储
      const newWakeTime = wakeRepository.create({
        value,
      });
      await wakeRepository.save(newWakeTime);

      // day创建时要存储wakeTime实例
      const newDay = dayRepository.create({
        wake: newWakeTime,
        value: dateTime,
      });
      await dayRepository.save(newDay);

      // day以及wake存储到目标用户中
      targetUser.wakes = [...targetUser.wakes, newWakeTime];
      targetUser.days = [...targetUser.days, newDay];
      await userRepository.save(targetUser);

      ctx.status = 200;
      ctx.body = {
        status: true,
        data: "起床时间打卡成功",
      };
      return;
    }

    // targetDay存在，且已存在wake
    if (targetDay.wake) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        errMsg: "当日起床时间已打卡",
      };
      return;
    }

    // 不存在wake，记录wake, 涉及到wake,user,day三张表
    // 创建 wakeTime 并存储
    const newWakeTime = wakeRepository.create({
      value,
    });
    await wakeRepository.save(newWakeTime);

    // 存储到目标用户中
    targetUser.wakes = [...targetUser.wakes, newWakeTime];
    await userRepository.save(targetUser);

    // 存储到day
    // targetDay.wake = value; wrong
    targetDay.wake = newWakeTime;
    await dayRepository.save(targetDay);

    ctx.status = 200;
    ctx.body = {
      status: true,
      data: "起床时间打卡成功了",
    };
  }

  public static async postSleepTime(ctx: Context) {
    const { userId, dateTime, value } = ctx.request.body;
    const userRepository = getManager().getRepository(User);
    const sleepRepository = getManager().getRepository(Sleep);
    const dayRepository = getManager().getRepository(Day);

    // 查询目标用户, where是条件，relations-关系需要加载
    const targetUser = await userRepository.findOne({
      where: { id: userId },
      relations: ["sleeps", "days"],
    });

    if (!targetUser) {
      ctx.status = 401;
      ctx.body = {
        status: false,
        errMsg: "用户不存在",
      };
      return;
    }

    // 查询目标日期
    const targetDay = await dayRepository.findOne({
      where: {value: dateTime},
      relations: ["wake", "sleep"],
    });

    console.log(targetDay);

    // targetDay不存在需要创建一个
    if (!targetDay) {
      // 创建 sleepTime 并存储
      const newSleepTime = sleepRepository.create({
        value,
      });
      await sleepRepository.save(newSleepTime);

      // 查找当前, 创建时要存储sleepTime实例
      const newDay = dayRepository.create({
        sleep: newSleepTime,
        value: dateTime,
      });
      await dayRepository.save(newDay);

      // 存储到目标用户中
      targetUser.sleeps = [...targetUser.sleeps, newSleepTime];
      targetUser.days = [...targetUser.days, newDay];
      await userRepository.save(targetUser);

      ctx.status = 200;
      ctx.body = {
        status: true,
        data: "睡觉时间打卡成功",
      };
      return;
    }

    // targetDay存在，已存在sleep
    if (targetDay.sleep) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        errMsg: "当日睡觉时间已打卡",
      };
      return;
    }

    // 不存在sleep，记录sleep, 涉及到sleep,user,day三张表
    // 创建 sleepTime 并存储
    const newSleepTime = sleepRepository.create({
      value,
    });
    await sleepRepository.save(newSleepTime);

    // 存储到目标用户中
    targetUser.sleeps = [...targetUser.sleeps, newSleepTime];
    await userRepository.save(targetUser);

    // 存储到day
    targetDay.sleep = newSleepTime;
    await dayRepository.save(targetDay);

    ctx.status = 200;
    ctx.body = {
      status: true,
      data: "睡觉时间打卡成功了",
    };
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

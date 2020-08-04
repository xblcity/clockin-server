import { Context } from "koa";
import { getManager } from "typeorm";

import { User, Day } from "../entity/index";

class TimeController {
  public static async postTime(ctx: Context) {
    const { userId, dateTime, wakeTime, sleepTime } = ctx.request.body;
    const userRepository = getManager().getRepository(User);
    const dayRepository = getManager().getRepository(Day);

    // 查询目标用户, where是条件，relations-关系需要加载(简单理解为联查)
    const targetUser = await userRepository.findOne({
      where: { id: userId },
      relations: ["days"],
    });

    if (!targetUser) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        errMsg: "用户不存在",
      };
      return;
    }

    let timeMarker, timeMarkerValue;
    if (wakeTime) {
      timeMarker = "wakeTime";
      timeMarkerValue = wakeTime;
    }
    if (sleepTime) {
      timeMarker = "sleepTime";
      timeMarkerValue = sleepTime;
    }

    // 查询目标日期
    const targetDay = await dayRepository.findOne({
      where: { dateTime },
    });

    // targetDay不存在需要创建一个
    if (!targetDay) {
      const newDay = dayRepository.create({
        dateTime,
        [timeMarker]: timeMarkerValue
      });
      await dayRepository.save(newDay);

      // day存储到目标用户中
      targetUser.days = [...targetUser.days, newDay];
      await userRepository.save(targetUser);

      ctx.status = 200;
      ctx.body = {
        status: true,
        data: "打卡成功",
      };
      return;
    }

    if (targetDay[timeMarker]) {
      const timeType = wakeTime ? '起床' : '睡觉'
      ctx.status = 404;
      ctx.body = {
        status: false,
        errMsg: `当日${timeType}已打卡`,
      };
      return;
    }

    // 存储到day
    targetDay[timeMarker] = timeMarkerValue;
    await dayRepository.save(targetDay);

    ctx.status = 200;
    ctx.body = {
      status: true,
      data: "打卡成功了",
    };
  }

  public static async postDayList(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const { userId, start, end } = ctx.request.body;

    if (!userId) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        errMsg: "缺少必要参数",
      };
    }

    const targetUser = await userRepository.findOne({
      where: { id: userId },
    });
    if (!targetUser) {
      ctx.status = 404;
      ctx.body = {
        status: false,
        errMsg: "用户不存在",
      };
    }

    // 查询days
    const daysList = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.days", "day")
      .where("user.id = :id", { id: userId })
      .select()
      .getOne();

    // 所需数据: 平均早起，平均早睡，平均睡眠
    // 当日是否已打卡 日历

    console.log(daysList);

    if (targetUser) {
      ctx.status = 200;
      ctx.body = daysList;
    } else {
      ctx.status = 404;
    }
  }

  public static postTimeExtreme(ctx: Context) {
    // 查询 sleep Earliest
    // 查询 wake Earliest
    // 查询  sleepTime Earliest
  }
}

export default TimeController;

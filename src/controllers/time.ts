import { Context } from "koa";
import { getManager } from "typeorm";
import moment from "moment";

import { User, Day } from "../entity/index";
import { calculateAverageTime } from "../utils";

class TimeController {
  public static async postTime(ctx: Context) {
    const { userId, dateTime, wakeUpTime, bedTime } = ctx.request.body;
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
    if (wakeUpTime) {
      timeMarker = "wakeUpTime";
      timeMarkerValue = wakeUpTime;
    }
    if (bedTime) {
      timeMarker = "bedTime";
      timeMarkerValue = bedTime;
    }

    const yesterday = moment(dateTime).subtract(1, "days").format("YYYY-MM-DD");
    const prevDay = await dayRepository.findOne({
      where: { dateTime: yesterday },
    });
    const prevBedTime = prevDay && prevDay.bedTime;
    const prevSleepTime = prevDay && prevDay.sleepTime;
    // 查询目标日期
    const targetDay = await dayRepository.findOne({
      where: { dateTime },
    });

    // targetDay不存在需要创建一个
    if (!targetDay) {
      const newDay = dayRepository.create({
        dateTime,
        [timeMarker]: timeMarkerValue,
      });
      await dayRepository.save(newDay);

      if (prevBedTime && wakeUpTime) {
        const diffTime = moment(`${dateTime} ${wakeUpTime}`).diff(
          `${yesterday} ${prevBedTime}`,
          "minute"
        );
        const hTime = (diffTime / 60).toFixed(2);
        prevDay.sleepTime = hTime;
        await dayRepository.save(prevDay);
      }

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
      const timeType = wakeUpTime ? "起床" : "睡觉";
      ctx.status = 404;
      ctx.body = {
        status: false,
        errMsg: `当日${timeType}已打卡`,
      };
      return;
    }

    if (!prevSleepTime && prevBedTime && timeMarker === "wakeUpTime") {
      const diffTime = moment(`${dateTime} ${wakeUpTime}`).diff(
        `${yesterday} ${prevBedTime}`,
        "minute"
      );
      if (isNaN(diffTime)) return;
      const hTime = (diffTime / 60).toFixed(2);
      prevDay.sleepTime = hTime;
      await dayRepository.save(prevDay);
    }

    // day存在 直接存储到day
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
    // const { userId, type, start, end } = ctx.request.body;
    const { userId, type = "week" } = ctx.request.body;

    if (!userId) {
      ctx.status = 400;
      ctx.body = {
        status: false,
        errMsg: "缺少必要参数",
      };
    }

    let start, end;
    if (type === "week") {
      // 第一步: 获取今天是本周的第几天
      const weekOfDay = Number(moment().format("E"));
      // 第二步: 获取本周周一的日期
      start = moment()
        .subtract(weekOfDay - 1, "days")
        .format("YYYY-MM-DD");
      // 第三步: 获取本周周末的日期
      end = moment()
        .add(7 - weekOfDay, "days")
        .format("YYYY-MM-DD");
    } else if (type === "month") {
      // 获取第一天
      start = moment().startOf("month").format("YYYY-MM-DD");
      end = moment().endOf("month").format("YYYY-MM-DD");
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

    console.log(start, end);

    // 查询条件days
    const daysList = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.days", "day")
      .where("user.id = :id", { id: userId })
      .andWhere("day.dateTime >= :start AND day.dateTime <= :end", {
        start: start,
        end: end,
      })
      .select()
      .getOne();

    // 查询所有days
    const totalDaysList = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.days", "day")
      .where("user.id = :id", { id: userId })
      .select()
      .getOne();

    let averageWakeUpTime,
      averageBedTime,
      averageSleepTime,
      totalAverageWakeUpTime,
      totalAverageBedTime,
      totalAverageSleepTime;

    const handleAverage = (daysList) => {
      const sleepTimeList = daysList.days
        .filter((item) => item.sleepTime)
        .map((item) => Number(item.sleepTime));

      const averageSleepTimeResult = (
        sleepTimeList.reduce((prev, item) => prev + item, 0) /
        sleepTimeList.length
      ).toFixed(2);

      const averageWakeUpTimeResult = calculateAverageTime(
        daysList.days
          .filter((item) => item.wakeUpTime)
          .map((item) => item.wakeUpTime)
      );

      const averageBedTimeResult = calculateAverageTime(
        daysList.days.filter((item) => item.bedTime).map((item) => item.bedTime)
      );

      return [
        averageSleepTimeResult,
        averageWakeUpTimeResult,
        averageBedTimeResult,
      ];
    };
    if (daysList.days.length) {
      const currentResult = handleAverage(daysList);
      averageSleepTime = currentResult[0];
      averageWakeUpTime = currentResult[1];
      averageBedTime = currentResult[2];
    }
    if (totalDaysList.days.length) {
      const totalResult = handleAverage(totalDaysList);
      totalAverageSleepTime = totalResult[0];
      totalAverageWakeUpTime = totalResult[1];
      totalAverageBedTime = totalResult[2];
    }

    // 所需数据: 平均早起，平均早睡，平均睡眠
    // 打卡 list
    // 所有数据：平均早起，平均早睡，平均睡眠

    if (targetUser) {
      ctx.status = 200;
      ctx.body = {
        dayList: daysList.days,
        averageSleepTime,
        averageWakeUpTime,
        averageBedTime,
        totalAverageSleepTime,
        totalAverageWakeUpTime,
        totalAverageBedTime,
      };
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

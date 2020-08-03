import { Entity, Column, ManyToOne, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User, Wake, Sleep} from './index'

@Entity()
export class Day implements IDay.Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  sleepTime: number;

  // 一个user对应多个day, day反向映射
  @ManyToOne(
    () => User,
    user => user.days
  )
  user: User;

  // 一个day对应一个sleep
  // joinColumn的一侧，day表会多出 wakeId 列
  // 查询的时候需要使用relations api
  @OneToOne(
    () => Wake,
    wake => wake.day
  )
  @JoinColumn()
  wake: Wake;

  // 一个day对应一个wake
  @OneToOne(
    () => Sleep,
    sleep => sleep.day
  )
  @JoinColumn()
  sleep: Sleep;

}

export default Day;
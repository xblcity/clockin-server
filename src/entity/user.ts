import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Wake, Sleep, Day} from './index'

@Entity()
export class User implements IUser.Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  openid: string;

  // 一个user对应多个wake
  // 每个wake只对应一个user
  // 对应到数据库，wake表会有一个userId键
  @OneToMany(
    () => Wake,
    wake => wake.user
  )
  wakes: Wake[];

  // 一个user对应多个sleep
  // 每个sleep只对应一个user
  // 对应到数据库，sleep表会有一个userId键
  @OneToMany(
    () => Sleep,
    sleep => sleep.user
  )
  sleeps: Sleep[];

  // 一个user对应多个day
  // 每个day只对应一个user
  // 对应到数据库，day表会有一个userId键
  @OneToMany(
    () => Day,
    day => day.user
  )
  days: Day[];
}

export default User;

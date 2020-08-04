import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Day } from "./index";

@Entity()
export class User implements IUser.Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  openid: string;

  // 一个user对应多个day
  // 每个day只对应一个user
  // 对应到数据库，day表会有一个userId键
  @OneToMany(() => Day, (day) => day.user)
  days: Day[];
}

export default User;

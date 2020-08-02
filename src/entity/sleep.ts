import { Entity, Column, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User, Day} from './index'

@Entity()
export class Sleep implements ISleep.Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  // 一个user对应多个sleep，反向映射
  @ManyToOne(
    () => User,
    user => user.sleeps
  )
  user: User;

  // 一个sleep对应一个day
  @OneToOne(
    () => Day,
    day => day.sleep
  )
  day: Day;

}

export default Sleep;
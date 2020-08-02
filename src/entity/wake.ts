import { Entity, Column, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User, Day} from './index'

@Entity()
export class Wake implements IWake.Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  // 一个user对应多个wake，
  @ManyToOne(
    () => User,
    user => user.wakes
  )
  user: User;

  // 一个wake对应一个day
  @OneToOne(
    () => Day,
    day => day.wake
  )
  day: Day;

}

export default Wake;
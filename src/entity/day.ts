import { Entity, Column, ManyToOne, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { User} from './index'

@Entity()
export class Day implements IDay.Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateTime: string;

  @Column({default: ''})
  sleepTime: string;

  @Column({default: ''})
  wakeUpTime: string;

  @Column({default: ''})
  bedTime: string;

  // 一个user对应多个day, day反向映射
  @ManyToOne(
    () => User,
    user => user.days
  )
  user: User;

}

export default Day;
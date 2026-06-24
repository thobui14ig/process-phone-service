import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LEVEL {
  ADMIN = 1,
  USER = 0,
}

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: LEVEL.USER })
  level?: LEVEL;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'expired_at' })
  expiredAt: string;

  @Column({ default: false, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'plan_id' })
  planId: number;
}

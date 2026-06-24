import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum VpsStatus {
  Live = 'live',
  Die = 'die',
}

@Entity('vps')
export class VpsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  port: number;

  @Column()
  speed: string;

  @Column({ default: VpsStatus.Live })
  status: VpsStatus;
}

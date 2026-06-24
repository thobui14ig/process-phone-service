import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ProxyStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

export enum ProxyType {
  GET_CMT = 1,
  GET_INFO = 2,
  GET_PAGE = 3,
}

@Entity('proxy')
export class ProxyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'proxy_address', type: 'varchar', length: 100 })
  proxyAddress: string;

  @Column({ default: 'active' })
  status: ProxyStatus;

  @Column({ default: false, name: 'is_fb_block' })
  isFbBlock: boolean;

  @Column({ name: 'type' })
  type: ProxyType;
}

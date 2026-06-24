import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('group_auto')
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true, name: 'group_id' })
  groupId: string;

  @Column({ name: 'user_id' })
  userId: number;
}

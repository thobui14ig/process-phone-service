import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'post_id', type: 'varchar', length: 255 })
  postId: string;

  @Column({ name: 'user_uid' })
  userUid: string;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'message', type: 'text', nullable: true })
  message: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column({ name: 'cmt_id' })
  cmtId: string;

  @Column({ name: 'link_id' })
  linkId: number;

  @Column({ name: 'is_process_phone' })
  isProcessPhone: boolean;
}

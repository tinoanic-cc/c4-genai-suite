import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, Repository, UpdateDateColumn } from 'typeorm';
import { ConfigurationUserEntity } from './configuration-user';
import { ConversationEntity } from './conversation';
import { FileEntity } from './file';
import { UserGroupEntity } from './user-group';

export type UserRepository = Repository<UserEntity>;

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ length: 100, nullable: true })
  apiKey?: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @OneToMany(() => ConversationEntity, (conversation) => conversation.configuration, { onDelete: 'CASCADE' })
  conversations!: ConversationEntity[];

  @OneToMany(() => FileEntity, (file) => file.user, { onDelete: 'CASCADE' })
  files!: FileEntity[];

  @ManyToOne(() => UserGroupEntity, (userGroup) => userGroup.users, { onDelete: 'NO ACTION' })
  userGroup!: UserGroupEntity;

  @OneToMany(() => ConfigurationUserEntity, (uc) => uc.user)
  configurations!: ConfigurationUserEntity[];

  @Column({ nullable: true })
  userGroupId!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}

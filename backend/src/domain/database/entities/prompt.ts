import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { PromptCategoryEntity } from './prompt-category';
import { PromptRatingEntity } from './prompt-rating';
import { PromptUsageEntity } from './prompt-usage';
import { PromptVersionEntity } from './prompt-version';
import { UserEntity } from './user';

export type PromptRepository = Repository<PromptEntity>;

@Entity({ name: 'prompts' })
export class PromptEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ length: 1000, nullable: true })
  description?: string;

  @Column({ default: true })
  isPublic!: boolean;

  @Column({ nullable: true })
  originalPromptId?: number; // For cloned prompts

  @Column({ default: 0 })
  usageCount!: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating!: number;

  @Column({ default: 0 })
  ratingCount!: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  author!: UserEntity;

  @Column()
  authorId!: string;

  @ManyToOne(() => PromptCategoryEntity, (category) => category.prompts, { onDelete: 'SET NULL' })
  category?: PromptCategoryEntity;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(() => PromptEntity, (prompt) => prompt.id, { onDelete: 'SET NULL' })
  originalPrompt?: PromptEntity;

  @OneToMany(() => PromptRatingEntity, (rating) => rating.prompt)
  ratings!: PromptRatingEntity[];

  @OneToMany(() => PromptUsageEntity, (usage) => usage.prompt)
  usages!: PromptUsageEntity[];

  @OneToMany(() => PromptVersionEntity, (version) => version.prompt)
  versions!: PromptVersionEntity[];

  @Column({ default: 1 })
  currentVersion!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}

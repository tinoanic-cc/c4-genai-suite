import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCategoryEntity } from '../database/entities/task-category';
import { PromptsModule } from '../prompts/module';
import { TaskCategoriesService } from './task-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskCategoryEntity]), PromptsModule],
  controllers: [],
  providers: [TaskCategoriesService],
  exports: [TaskCategoriesService],
})
export class TasksModule {}

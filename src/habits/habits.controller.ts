import { Controller, Get, Post, Body } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { Habit } from '@prisma/client';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async getHabits(): Promise<Array<Habit>> {
    return this.habitsService.getAll();
  }

  @Post()
  async createHabit(
    @Body('name') name: string,
  ): Promise<Habit | { error: string }> {
    if (!name || name.trim() === '') {
      return { error: 'Name is required' };
    }

    return this.habitsService.add(name);
  }
}

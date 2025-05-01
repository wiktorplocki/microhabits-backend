import { Body, Controller, Get, Post } from '@nestjs/common';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  getHabits() {
    return this.habitsService.getAll();
  }

  @Post()
  createHabit(@Body('name') name: string) {
    if (!name || name.trim() === '') {
      return {
        error: 'Habit name is required',
      };
    }

    return this.habitsService.add(name.trim());
  }
}

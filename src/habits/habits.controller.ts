import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
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

  @Delete(':id')
  async deleteHabit(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.habitsService.delete(id);
    return { message: 'Habit deleted successfully' };
  }
}

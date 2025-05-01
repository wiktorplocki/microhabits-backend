import { Injectable } from '@nestjs/common';
import { Habit } from './habits.model';

@Injectable()
export class HabitsService {
  private habits: Array<Habit> = [];
  private nextId = 1;

  getAll(): Array<Habit> {
    return this.habits;
  }

  add(name: string): Habit {
    const habit: Habit = {
      id: this.nextId++,
      name,
      createdAt: new Date(),
    };

    this.habits.push(habit);
    return habit;
  }
}

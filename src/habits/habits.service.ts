import { Injectable } from '@nestjs/common';
import { Habit } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Array<Habit>> {
    return this.prisma.habit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async add(name: string): Promise<Habit> {
    return this.prisma.habit.create({
      data: {
        name,
      },
    });
  }
}

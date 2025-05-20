import { Injectable, NotFoundException } from '@nestjs/common';
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

  async delete(id: number): Promise<void> {
    const habit = await this.prisma.habit.findUnique({
      where: { id },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    await this.prisma.habit.delete({
      where: { id },
    });
  }
}

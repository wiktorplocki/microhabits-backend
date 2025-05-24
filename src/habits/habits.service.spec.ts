import { Test, TestingModule } from '@nestjs/testing';
import { Habit } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  habit: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
};

describe('HabitsService', () => {
  let service: HabitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all habits', async () => {
    const mockHabits: Array<Habit> = [
      { id: 1, name: 'Habit 1', createdAt: new Date() },
      { id: 2, name: 'Habit 2', createdAt: new Date() },
    ];

    mockPrismaService.habit.findMany.mockResolvedValue(mockHabits);

    const result = await service.getAll();

    expect(result).toEqual(mockHabits);
    expect(mockPrismaService.habit.findMany).toHaveBeenCalled();
  });

  it('should throw NotFoundException if habit not found', async () => {
    mockPrismaService.habit.findUnique.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a habit', async () => {
    const habit = { id: 1, name: 'New Habit', createdAt: new Date() };
    mockPrismaService.habit.create.mockResolvedValue(habit);

    const result = await service.add('New Habit');
    expect(result).toEqual(habit);
    expect(mockPrismaService.habit.create).toHaveBeenCalledWith({
      data: { name: 'New Habit' },
    });
  });

  it('should delete habit by ID', async () => {
    const habit = { id: 1, name: 'Test', createdAt: new Date() };
    mockPrismaService.habit.findUnique.mockResolvedValue(habit);
    mockPrismaService.habit.delete.mockResolvedValue(habit);

    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(mockPrismaService.habit.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException when deleting a non-existent habit', async () => {
    mockPrismaService.habit.findUnique.mockResolvedValue(null);

    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    expect(mockPrismaService.habit.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  it('should throw NotFoundException on delete if habit not found', async () => {
    mockPrismaService.habit.findUnique.mockResolvedValue(null);

    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    expect(mockPrismaService.habit.delete).not.toHaveBeenCalled();
  });
});

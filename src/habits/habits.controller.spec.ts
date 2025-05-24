import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Habit } from '@prisma/client';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

const mockHabitsService = {
  getAll: jest.fn(),
  getById: jest.fn(),
  add: jest.fn(),
  delete: jest.fn(),
};

describe('HabitsController', () => {
  let controller: HabitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [
        {
          provide: HabitsService,
          useValue: mockHabitsService,
        },
      ],
    }).compile();

    controller = module.get<HabitsController>(HabitsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all habits', async () => {
    const habits: Array<Habit> = [
      { id: 1, name: 'Habit 1', createdAt: new Date() },
      { id: 2, name: 'Habit 2', createdAt: new Date() },
    ];

    mockHabitsService.getAll.mockResolvedValue(habits);

    const result = await controller.getHabits();
    expect(result).toEqual(habits);
    expect(mockHabitsService.getAll).toHaveBeenCalled();
  });

  it('should create a habit', async () => {
    const habit: Habit = { id: 1, name: 'New Habit', createdAt: new Date() };
    mockHabitsService.add.mockResolvedValue(habit);

    const result = await controller.createHabit('New Habit');
    expect(result).toEqual(habit);
    expect(mockHabitsService.add).toHaveBeenCalledWith('New Habit');
  });

  it('should return an error if name is empty', async () => {
    const result = await controller.createHabit('');
    expect(result).toEqual({ error: 'Name is required' });
    expect(mockHabitsService.add).not.toHaveBeenCalled();
  });

  it('should return error if name is missing', async () => {
    const result = await controller.createHabit('');
    expect(result).toEqual({ error: 'Name is required' });
    expect(mockHabitsService.add).not.toHaveBeenCalled();
  });

  it('should delete habit by ID', async () => {
    mockHabitsService.delete.mockResolvedValue(undefined);

    const result = await controller.deleteHabit(1);
    expect(result).toEqual({ message: 'Habit deleted successfully' });
    expect(mockHabitsService.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if habit not found', async () => {
    mockHabitsService.delete.mockRejectedValue(new NotFoundException());

    await expect(controller.deleteHabit(999)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockHabitsService.delete).toHaveBeenCalledWith(999);
  });
});

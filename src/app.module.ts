import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { HabitsModule } from './habits/habits.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [HabitsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

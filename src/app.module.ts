import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './token/token.service';
import { JwtService } from '@nestjs/jwt';
import { EmailModule } from './email/email.module';
import { PrismaService } from './prisma.service';
import { WateringService } from './watering/watering.service';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { PlantsService } from './plants/plants.service';
import { PlantsController } from './plants/plants.controller';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { TelegramModule } from './bot/telegram.module';
import { ImageService } from './image/image.service';
import { ImageController } from './image/image.controller';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
    TelegramModule,
  ],
  controllers: [AdminController, PlantsController, ProfileController, ImageController],
  providers: [
    TokenService,
    JwtService,
    PrismaService,
    WateringService,
    AdminService,
    PlantsService,
    ProfileService,
    ImageService,
  ],
})
export class AppModule {}

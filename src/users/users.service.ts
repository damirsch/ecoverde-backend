import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  findOne(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  update(email: string, updateUserDto: Partial<CreateUserDto>) {
    return this.prismaService.user.update({
      where: { email },
      data: updateUserDto,
    });
  }
}

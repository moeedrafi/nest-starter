import { Controller, Delete, Get, Patch } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAllUsers() {}

  @Patch('/:id')
  async updateUser() {}

  @Delete('/:id')
  async removeUser() {}
}

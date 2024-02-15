import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../models/user.js';
import { UpdateUserDto } from '../auth/auth.dto';
import { ValidationPipeWithErrors } from 'src/middlewares/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: User): User {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: number): User {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): User {
    return this.usersService.deleteUserById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipeWithErrors())
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto | string> {
    return await this.usersService.updateUserById(id, updateUserDto);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from '../../models/user.js';
import { CreateUserDto, UpdateUserDto } from '../auth/auth.dto';
import { ValidationPipeWithErrors } from 'src/middlewares/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/data/interfaces';
import { Roles } from 'src/middlewares/role/role.decorator';
import { Reflector } from '@nestjs/core';
import { RoleGuard } from 'src/middlewares/role/role.guard';
import { UsersService } from './users.service.js';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipeWithErrors())
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const response = await this.usersService.createUser(createUserDto);
      return response;
    } catch (error) {
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.USER)
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

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../models/user.js';
@Controller('users')
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
  findOne(@Param('id') id:number):User{
    return this.usersService.getUserById(id)
  }

  @Delete(":id")
  remove(@Param('id') id:number):User{
    return this.usersService.deleteUserById(id)
  }

  @Put(':id')
  update(@Param('id') id:number , @Body() updateUserDto:Partial<User>):User{
    return this.usersService.updateUserById(id,updateUserDto)
  }
}

import { Injectable, NotFoundException, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
const db = require('../../models');
import { Request } from 'express';
import { User } from '../../models/user.js';
import { UpdateUserDto } from 'src/auth/auth.dto.js';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UsersService {
  async createUser(data: any) {
    try {
      const user = await db.User.create(data);
      return user;
    } catch (error) {
      throw new Error(`failed to create user ${error.message}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await db.User.findAll();
      return users;
    } catch (error) {
      throw new Error(`failed to get users ${error.message}`);
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await db.User.findByPk(id);
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new Error(`failed to get the user ${error.message}`);
    }
  }

  async updateUserById(id: number, data: UpdateUserDto): Promise<UpdateUserDto | string> {
    try {
      const user = await this.getUserById(id);
      if (user != 'user not found') { 
        await db.User.update(data, { where: { id: id } });
        return data;
      } else {
        return `User with ID ${id} not found.`;
      }
    } catch (error) {
      throw new Error(`failed to get the user ${error.message}`);
    }
  }



  async deleteUserById(id: number): Promise<User | 'user not found'> {
    try {
      const user = await this.getUserById(id);
      if (user != 'user not found') {
        await db.User.destroy({ where: { id: id } });
        return user;
      } else {
        return 'user not found';
      }
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }
  


  async findOne(email: string): Promise<User | null> {
    try {
      const user = await db.User.findOne({ where: { email: email } });
      return user ;
    } catch (error) {
      throw new Error(`failed to find user ${error.message}`);
    }
  }
}

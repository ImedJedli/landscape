import { Injectable } from '@nestjs/common';
const db = require('../../models');

import { User } from '../../models/user.js';

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
        return 'user not found';
      }
      return user;
    } catch (error) {
      throw new Error(`failed to get the user ${error.message}`);
    }
  }

  async updateUserById(id: number, data: any): Promise<string> {
    try {
      const user = await this.getUserById(id);
      if (user != 'user not found') {
        await db.User.update(data, { where: { id: id } });
        return `User with ID ${id} updated successfully : ${JSON.stringify(data)}`;
      } else {
        return `User with ID ${id} not found.`;
      }
    } catch (error) {
      throw new Error(`failed to get the user ${error.message}`);
    }
  }

  async deleteUserById(id: number): Promise<string> {
    try {
      const user = await this.getUserById(id);
      if (user != 'user not found') {
        await db.User.destroy({ where: { id: id } });
        return `User with ID ${id} deleted successfully.`;
      } else {
        return `User with ID ${id} not found.`;
      }
    } catch (error) {
      throw new Error(`failed to get the user ${error.message}`);
    }
  }
}

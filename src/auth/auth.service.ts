import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const db = require('../../models');
import { User } from '../../models/user.js';
import { CreateUserDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await db.User.findOne({ where: { email: email } });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user.toJSON();
        return result;
      }
      return null;
    } catch (error) {
      throw new Error(`failed to validate user ${error.message}`);
    }
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async signUp(
    userData: CreateUserDto,
  ): Promise<{ user: CreateUserDto; access_token: string }> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const newUser = await db.User.create({
        ...userData,
        password: hashedPassword,
      });
      const payload = { email: newUser.email, sub: newUser.id };
      const token = this.jwtService.sign(payload);
      return { user: newUser, access_token: token };
    } catch (error) {
      throw new Error(`Failed to sign up user: ${error.message}`);
    }
  }
}

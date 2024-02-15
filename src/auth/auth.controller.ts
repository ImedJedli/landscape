import { Controller, Request, Post, UseGuards, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../models/user.js';
import { CreateUserDto, LoginDto } from './auth.dto';
import { ValidationPipeWithErrors } from '../middlewares/validation.pipe';
const db = require('../../models');


@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @UsePipes(new ValidationPipeWithErrors())
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
      const { email, password } = loginDto;
    const token = await this.authService.login(email, password);
    const { sub, email: userEmail } = this.jwtService.decode(token) as {
      sub: string;
      email: string;
    };
    return { access_token: token };
  }


  @Post('signup')
  @UsePipes(new ValidationPipeWithErrors())
  async signUp(@Body() createUserDto: CreateUserDto): Promise<{ user: any, access_token: string }> {
    const { user, access_token } = await this.authService.signUp(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, access_token };
  }
}

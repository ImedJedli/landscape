import {
  Controller,
  Post,
  Body,
  UsePipes,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto } from './auth.dto';
import { ValidationPipeWithErrors } from '../middlewares/validation.pipe';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @UsePipes(new ValidationPipeWithErrors())
  async login(@Body() loginDto: LoginDto): Promise<{
    id: string;
    access_token: string;
    email: string;
    role: string;
  }> {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.authService.login(email, password);
    const { sub, email: userEmail } = this.jwtService.decode(token) as {
      sub: string;
      email: string;
    };
    return { id: sub, access_token: token, email: userEmail, role: user.role };
  }

  @Post('signup')
  @UsePipes(new ValidationPipeWithErrors())
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: any; access_token: string }> {
    const { user, access_token } = await this.authService.signUp(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, access_token };
  }
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    //check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    //remove password from return
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    //check if user exists
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    //check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Password is incorrect');
    }
    //create token
    const token = this.jwtService.sign({ userId: user.id });
    //remove password from return
    const { password: _, ...result } = user;
    return { ...result, token };
  }
}

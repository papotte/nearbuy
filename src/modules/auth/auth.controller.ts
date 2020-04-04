import {
  Controller,
  Request,
  Post,
  UseGuards,
  Logger,
  Body,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { TokenDto } from './dto/token.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login by email and password ' })
  @ApiOkResponse({
    description: 'Successful Login',
    type: TokenDto,
  })
  async login(@Request() req, @Body() _: LoginDto): Promise<TokenDto> {
    this.logger.log(`User login`);
    return await this.authService.createToken(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register with email and password ' })
  @ApiCreatedResponse({
    description: 'Successful Registration',
    type: TokenDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotAcceptableResponse({ description: 'Already exists' })
  async register(@Body() payload: RegisterDto): Promise<TokenDto> {
    const user = await this.usersService.create(payload);
    this.logger.log(`User registered: ${user.id}`);
    this.logger.debug(`Email: ${payload.email}`);
    return await this.authService.createToken(user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Not yet implemented, token refresh' })
  @ApiCreatedResponse({
    description: 'Successful token refresh',
    type: TokenDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async refreshToken(@Body() token: TokenDto): Promise<TokenDto> {
    // TODO
    return;
  }
}

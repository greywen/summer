import { IAuthDto } from '@dtos/auth';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import KcClient from '@utils/kcClient';
import { AuthService } from '@services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { NestRes } from '@interfaces/nestbase';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/url')
  async getAuthUrl() {
    return await KcClient.client.authorizationUrl();
  }

  @Post('/authentication')
  async authentication(@Body() authDto: IAuthDto) {
    const { code, state, session_state } = authDto;
    return await this.authService.signin(code, state, session_state);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/signout')
  async signout(@Request() req: NestRes) {
    return await this.authService.signout(req.user.idToken);
  }
}

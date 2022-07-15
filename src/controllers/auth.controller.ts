import { IAuthDto } from '@dtos/auth';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '@services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { NestRes } from '@interfaces/nestbase';
import NodeKeycloak from 'node-keycloak';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/url')
  async getAuthUrl() {
    return await NodeKeycloak.authorizationUrl();
  }

  @Post('/authentication')
  async authentication(@Body() authDto: IAuthDto) {
    const { code, session_state } = authDto;
    return await this.authService.signin(code, session_state);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/signout')
  async signout(@Request() req: NestRes) {
    return await this.authService.signout(req.user.idToken);
  }
}

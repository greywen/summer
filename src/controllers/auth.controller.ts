import { IAuthDto } from '@dtos/auth';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import KcClient from '@utils/kcClient';
import { AuthService } from '@services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Get("/url")
    async getAuthUrl() {
        return await KcClient.client.authorizationUrl();
    }

    @Post("/authentication")
    async authentication(@Body() authDto: IAuthDto) {
        const { code, state, session_state } = authDto;
        return await this.authService.signin(code, state, session_state);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("/signout")
    async signout() {
        return await this.authService.signout();
    }
}

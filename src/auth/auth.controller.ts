import { Controller, Post, UseGuards, Request, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Controller('auth') 
export class AuthController {
    private readonly logger: Logger = new Logger(AuthController.name);
    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() request) {
        this.logger.debug('a new request arived')
        return {
            userId: request.user.id,
            token: 'the token will go here'
        }
    }
}

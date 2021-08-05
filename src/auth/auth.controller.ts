import { 
        Controller, 
        Post, 
        UseGuards, 
        Request, 
        Logger,
        Get
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";


@Controller('auth') 
export class AuthController {
    
    private readonly logger: Logger = new Logger(AuthController.name);

    constructor(private readonly authService:AuthService) {}


    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() request) {
        this.logger.debug('a new  login request is arived')
        return {
            userId: request.user.id,
            token: this.authService.getTokenForUser(request.user)
        }
    }
    
    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() request) {
      return request.user; 
    }
}

import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto, RegisterDto } from './auth.dto';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { User } from './user.decorator';

@Controller('auth')
@ApiTags('Autenticação')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Realizar login',
    description: 'Autentica um usuário e retorna tokens de acesso e refresh',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais de login',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Renovar token de acesso',
    description: 'Renova o token de acesso usando o refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de refresh inválido',
  })
  async refresh(@User() user: any): Promise<AuthResponseDto> {
    const refreshToken = user.refreshToken;
    return this.authService.refreshToken(refreshToken);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar novo usuário',
    description:
      'Cria uma nova conta de usuário e retorna tokens de autenticação',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Dados para cadastro do usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário cadastrado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }
}

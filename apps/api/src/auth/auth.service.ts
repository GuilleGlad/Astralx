import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserStatus } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);

    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24);

    const user = this.userRepository.create({
      email: registerDto.email,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role,
      emailVerificationToken,
      emailVerificationExpires,
      status: UserStatus.PENDING_VERIFICATION,
      emailVerified: false,
    });

    await this.userRepository.save(user);

    // Send verification email
    await this.mailService.sendVerificationEmail(
      user.email,
      emailVerificationToken
    );

    this.logger.log(`User registered successfully: ${user.id}`);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    this.logger.log(`Email verification attempt with token`);

    const user = await this.userRepository.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.status = UserStatus.ACTIVE;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await this.userRepository.save(user);

    this.logger.log(`Email verified successfully for user: ${user.id}`);

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);

    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in'
      );
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const tokens = await this.generateTokens(user);

    this.logger.log(`User logged in successfully: ${user.id}`);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    };
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(`Refresh token attempt`);

    const storedToken = await this.refreshTokenRepository.findOne({
      where: {
        token: refreshToken,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    if (!storedToken || storedToken.revokedAt) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke the old refresh token
    storedToken.revokedAt = new Date();
    await this.refreshTokenRepository.save(storedToken);

    // Generate new tokens
    const tokens = await this.generateTokens(storedToken.user);

    this.logger.log(
      `Tokens refreshed successfully for user: ${storedToken.user.id}`
    );

    return tokens;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    this.logger.log(`Password reset requested for email: ${email}`);

    const user = await this.userRepository.findOne({ where: { email } });

    // Don't reveal if user exists or not for security
    if (!user) {
      return {
        message:
          'If your email is registered, you will receive a password reset link.',
      };
    }

    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const passwordResetToken = this.passwordResetTokenRepository.create({
      userId: user.id,
      token: resetToken,
      expiresAt,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    // Send reset email
    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    this.logger.log(`Password reset token created for user: ${user.id}`);

    return {
      message:
        'If your email is registered, you will receive a password reset link.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    this.logger.log(`Password reset attempt with token`);

    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: {
        token,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    if (!resetToken || resetToken.usedAt) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    resetToken.user.passwordHash = passwordHash;

    await this.userRepository.save(resetToken.user);

    resetToken.usedAt = new Date();
    await this.passwordResetTokenRepository.save(resetToken);

    this.logger.log(
      `Password reset successfully for user: ${resetToken.user.id}`
    );

    return {
      message:
        'Password reset successfully. You can now log in with your new password.',
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new NotFoundException('User not found or inactive');
    }

    return user;
  }

  private async generateTokens(
    user: User
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'default-secret',
      expiresIn: '15m',
    });

    const refreshTokenString = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'default-refresh-secret',
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshTokenString,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);

    return { accessToken, refreshToken: refreshTokenString };
  }
}

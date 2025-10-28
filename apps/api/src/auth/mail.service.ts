import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const mailHost = this.configService.get<string>('MAIL_HOST');
    const mailPort = this.configService.get<number>('MAIL_PORT');
    const mailUser = this.configService.get<string>('MAIL_USER');
    const mailPassword = this.configService.get<string>('MAIL_PASSWORD');

    // Only create transporter if mail configuration exists
    if (mailHost && mailPort && mailUser && mailPassword) {
      this.transporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: this.configService.get<boolean>('MAIL_SECURE', false),
        auth: {
          user: mailUser,
          pass: mailPassword,
        },
      });
    } else {
      this.logger.warn(
        'Mail configuration not found. Email functionality will be simulated in development.'
      );
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationToken: string
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000'
    );
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM', 'noreply@astralx.com'),
      to: email,
      subject: 'Verify your Astralx account',
      html: `
        <h1>Welcome to Astralx!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    };

    await this.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000'
    );
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM', 'noreply@astralx.com'),
      to: email,
      subject: 'Reset your Astralx password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    await this.sendMail(mailOptions);
  }

  private async sendMail(
    mailOptions: nodemailer.SendMailOptions
  ): Promise<void> {
    try {
      if (this.transporter) {
        const info = await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email sent successfully: ${info.messageId}`);
      } else {
        // Development mode: log email instead of sending
        this.logger.log(`[DEV MODE] Email would be sent to: ${mailOptions.to}`);
        this.logger.log(`[DEV MODE] Subject: ${mailOptions.subject}`);
        this.logger.log(`[DEV MODE] Content: ${mailOptions.html}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      // Don't throw error in production to avoid breaking user flow
      // Email failures should be logged but not block user operations
    }
  }
}

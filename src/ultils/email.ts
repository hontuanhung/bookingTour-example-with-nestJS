import configEnv from 'configEnv';
import nodemailer, { Transporter } from 'nodemailer';

export default class Email {
  to: string | undefined;
  name: string | undefined;
  from: string | undefined;
  url: string | undefined;
  constructor(user: any, url: string) {
    this.to = user.email;
    this.name = user.name;
    this.from = `Ngoc Hung <${configEnv.EMAIL_USERNAME}>`;
    this.url = url;
  }

  newTransport(): Transporter {
    if (configEnv.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: configEnv.GMAIL_USERNAME,
          pass: configEnv.GMAIL_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: configEnv.EMAIL_HOST,
      port: configEnv.EMAIL_PORT,
      auth: {
        user: configEnv.EMAIL_USERNAME,
        pass: configEnv.EMAIL_PASSWORD,
      },
    });
  }

  async send(message: string, subject: string): Promise<any> {
    const mailOptions: object = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(): Promise<any> {
    await this.send(
      `Hello ${this.name}. Please click the link below to verify your email account:\n ${this.url}`,
      'Welcome to the Natours Family!',
    );
  }

  async sendPasswordReset(): Promise<void> {
    await this.send(
      `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${this.url}.\nIf you didn't forget your password, please ignore this email!`,
      'Your password reset token Valid for only 10 minutes)',
    );
  }
}

import { Injectable } from '@nestjs/common';
import { ContactMessageDto } from './dto/contact-message.dto';
import { sendMail, MailOptionsType } from '../utils/mail';
import { ContactTemplate } from 'src/templates/contact';
import { ConfirmProps } from 'src/auth/interface/confirm-props.interface';

@Injectable()
export class MessageService {
  constructor() {}

  async sendContactMessage(
    contactMessageDto: ContactMessageDto,
  ): Promise<void> {
    const mailOptionsType: MailOptionsType = {
      subject: `Contact message. ${contactMessageDto.name}. ${contactMessageDto.type}`,

      html: ContactTemplate(contactMessageDto),
      to: null,
    };

    await sendMail(mailOptionsType, (error, data) => {
      if (error) {
        console.log(error);
      }
    });
  }

  async sendAccountRecoveryMessage(email: string, code: string): Promise<void> {
    const mailOptionsType: MailOptionsType = {
      subject: 'Reset your password',
      html: `Your code to reset ${code}`,
      to: email,
    };

    await sendMail(mailOptionsType, (error, data) => {
      if (error) {
        console.log(error);
      }
    });
  }

  async sendSignupConfirmMessage(
    email: string,
    code: string,
    props: ConfirmProps,
  ): Promise<void> {
    const mailOptionsType: MailOptionsType = {
      subject: 'Reset your password',
      html: `Your code to reset ${code}`,
      to: email,
    };

    await sendMail(mailOptionsType, (error, data) => {
      if (error) {
        console.log(error);
      }
    });
  }
}

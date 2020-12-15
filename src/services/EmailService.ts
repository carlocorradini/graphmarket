/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import sendgrid, { MailDataRequired } from '@sendgrid/mail';
import config from '@app/config';
import logger from '@app/logger';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface ISendVerificationData {
  user: {
    username: string;
  };
}

sendgrid.setApiKey(config.SERVICES.EMAIL.SENDGRID_API_KEY);

/**
 * Email service.
 *
 * @see sendgrid
 */
@Service()
export default class EmailService {
  /**
   * Default email.
   */
  public static readonly DEFAULT_EMAIL: string = 'carlo.corradini@studenti.unitn.it';

  /**
   * Send email.
   *
   * @param message - The message data to send
   */
  public async send(message: PartialBy<MailDataRequired, 'from'>): Promise<void> {
    const mailData: MailDataRequired = {
      ...message,
      ...{ from: message.from ? message.from : EmailService.DEFAULT_EMAIL },
    } as MailDataRequired;

    try {
      await sendgrid.send(mailData);
    } catch (error) {
      logger.error(`Error sending email due to ${error.message}`);
      throw error;
    }
  }

  /**
   * Send verification code to the email.
   *
   * @param email - Email to send verification to
   * @param data - Send verification data
   */
  public async sendVerification(email: string, data: ISendVerificationData): Promise<void> {
    // TODO Implement
    try {
      await this.send({
        to: email,
        templateId: 'd-9a03967b1f4f4d25a1d1a326e3c3364f',
        dynamicTemplateData: {
          ...data,
          code: '123456',
        },
      });
    } catch (error) {
      logger.error(`Error sending email verification due to ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if the email can be verified with the code.
   *
   * @param email - Email to check
   * @param code - Verification code
   */
  public async checkVerification(email: string, code: string): Promise<void> {
    // TODO Implement

    logger.info(`DELETE ME FROM EMAIL!!! ${email} ---> ${code}`);
    return Promise.resolve();
  }
}

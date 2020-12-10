/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import sendgrid, { MailDataRequired } from '@sendgrid/mail';
import config from '@app/config';
import logger from '@app/logger';

sendgrid.setApiKey(config.SERVICES.EMAIL.SENDGRID_API_KEY);

/**
 * Email service.
 *
 * @see sendgrid
 */
@Service()
export default class EmailService {
  /**
   * Send email.
   *
   * @param message - The message data to send
   */
  public async send(message: MailDataRequired): Promise<void> {
    try {
      await sendgrid.send(message);
    } catch (error) {
      logger.error(`Error sending email due to ${error.message}`);
      throw error;
    }
  }
}

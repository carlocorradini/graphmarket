/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import sendgrid, { MailDataRequired } from '@sendgrid/mail';
import { EnvUtil } from '@graphmarket/utils';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface ISendVerificationData {
  user: {
    username: string;
  };
}

/**
 * Email adapter.
 *
 * @see sendgrid
 */
@Service()
export default class EmailAdapter {
  /**
   * Default email.
   */
  public static readonly DEFAULT_EMAIL: string = 'carlo.corradini@studenti.unitn.it';

  /**
   * Construct a new email adapter.
   *
   * @param apiKey - Email API key
   */
  public constructor(apiKey: string) {
    sendgrid.setApiKey(apiKey);
  }

  /**
   * Send email.
   *
   * @param message - The message data to send
   */
  public async send(message: PartialBy<MailDataRequired, 'from'>): Promise<void> {
    // TODO Email adapter can be used only in production environment
    if (!EnvUtil.isProduction()) return;

    const mailData: MailDataRequired = {
      ...message,
      ...{ from: message.from ? message.from : EmailAdapter.DEFAULT_EMAIL },
    } as MailDataRequired;

    await sendgrid.send(mailData);
  }

  /**
   * Send verification code to the email.
   *
   * @param email - Email to send verification to
   * @param data - Send verification data
   */
  public async sendVerification(email: string, data: ISendVerificationData): Promise<void> {
    // TODO Implement
    await this.send({
      to: email,
      templateId: 'd-9a03967b1f4f4d25a1d1a326e3c3364f',
      dynamicTemplateData: {
        ...data,
        code: '123456',
      },
    });
  }

  /**
   * Check if the email can be verified with the code.
   *
   * @param _email - Email to check
   * @param _code - Verification code
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async checkVerification(_email: string, _code: string): Promise<boolean> {
    // TODO Implement

    return Promise.resolve(true);
  }
}

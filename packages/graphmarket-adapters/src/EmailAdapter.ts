/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import sendgrid, { MailDataRequired } from '@sendgrid/mail';
// import { EnvUtil } from '@graphmarket/utils';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface ISendVerificationData {
  user: {
    username: string;
  };
}

export interface ISendPurchaseConfirmationData {
  user: {
    username: string;
  };
  product: {
    name: string;
    cover: string;
  };
  purchase: {
    quantity: number;
    amount: string;
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
  private static readonly DEFAULT_EMAIL: string = 'carlo.corradini@studenti.unitn.it';

  /**
   * Default verification code.
   */
  // TODO Remove
  private static readonly DEFAULT_VERIFICATION_CODE: string = '123456';

  /**
   * Initialize a new email adapter.
   *
   * @param apiKey - Email API key
   */
  public init(apiKey: string) {
    sendgrid.setApiKey(apiKey);
  }

  /**
   * Send email.
   *
   * @param message - The message data to send
   */
  public async send(message: PartialBy<MailDataRequired, 'from'>): Promise<void> {
    // TODO Email adapter can be used only in production environment
    // if (!EnvUtil.isProduction()) return;

    const mailData: MailDataRequired = {
      ...message,
      ...{ from: message.from ? message.from : EmailAdapter.DEFAULT_EMAIL },
    } as MailDataRequired;

    await sendgrid.send(mailData);
  }

  /**
   * Send verification code to the email.
   *
   * @param email - Email to send to
   * @param data - Template data
   */
  public async sendVerification(email: string, data: ISendVerificationData): Promise<void> {
    await this.send({
      to: email,
      templateId: 'd-fbc9d4df0cfc4ac28a64d7773b66661e',
      dynamicTemplateData: {
        ...data,
        code: EmailAdapter.DEFAULT_VERIFICATION_CODE,
      },
    });
  }

  /**
   * Send purchase confirmation to the email.
   *
   * @param email - Email to send to
   * @param data - Template data
   */
  public async sendPurchaseConfirmation(
    email: string,
    data: ISendPurchaseConfirmationData,
  ): Promise<void> {
    await this.send({
      to: email,
      templateId: 'd-c2406fb779a4413d99df822be8437417',
      dynamicTemplateData: data,
    });
  }

  /**
   * Check if the email can be verified with the code.
   *
   * @param _email - Email to check
   * @param code - Verification code
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async checkVerification(_email: string, code: string): Promise<boolean> {
    if (code === EmailAdapter.DEFAULT_VERIFICATION_CODE) return true;

    return false;
  }
}

/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { Twilio } from 'twilio';
import config from '@app/config';
import logger from '@app/logger';
import { EnvUtil } from '@app/utils';

/**
 * Phone service.
 *
 * @see Twilio
 */
@Service()
export default class PhoneService {
  private static readonly twilio: Twilio = new Twilio(
    config.SERVICES.PHONE.TWILIO_ACCOUNT_SID,
    config.SERVICES.PHONE.TWILIO_AUTH_TOKEN,
    { lazyLoading: true, logLevel: config.SERVICES.PHONE.DEBUG ? 'debug' : undefined },
  );

  /**
   * Send a verification code to the pgone number.
   *
   * @param phone - Phone number
   */
  public async sendVerification(phone: string): Promise<void> {
    // TODO Phone verification can be used only in production environment
    if (!EnvUtil.isProduction()) return;

    try {
      await PhoneService.twilio.verify
        .services(config.SERVICES.PHONE.TWILIO_VERIFICATION_SID)
        .verifications.create({ to: phone, channel: 'sms' });
    } catch (error) {
      logger.error(`Error sending phone verification due to ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if phone number can be verified with the code.
   *
   * @param phone - Phone number to check
   * @param code - Verification code
   */
  public async checkVerification(phone: string, code: string): Promise<void> {
    try {
      await PhoneService.twilio.verify
        .services(config.SERVICES.PHONE.TWILIO_VERIFICATION_SID)
        .verificationChecks.create({ to: phone, code });
    } catch (error) {
      logger.error(`Error verifying phone due to ${error.message}`);
      throw error;
    }
  }
}

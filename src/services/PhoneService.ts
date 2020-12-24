/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { Twilio } from 'twilio';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
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
   * Send a verification code to the phone number.
   *
   * @param phone - Phone number
   * @returns Verification instance data
   */
  public async sendVerification(phone: string): Promise<VerificationInstance> {
    // TODO Phone verification can be used only in production environment
    if (!EnvUtil.isProduction()) return (undefined as unknown) as VerificationInstance;

    try {
      return await PhoneService.twilio.verify
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
   * @returns Verification check instance data
   */
  public async checkVerification(phone: string, code: string): Promise<VerificationCheckInstance> {
    // TODO Phone verification can be used only in production environment
    if (!EnvUtil.isProduction()) return (undefined as unknown) as VerificationCheckInstance;

    try {
      return await PhoneService.twilio.verify
        .services(config.SERVICES.PHONE.TWILIO_VERIFICATION_SID)
        .verificationChecks.create({ to: phone, code });
    } catch (error) {
      logger.error(`Error verifying phone due to ${error.message}`);
      throw error;
    }
  }
}

/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { Twilio } from 'twilio';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { EnvUtil } from '@graphmarket/utils';

/**
 * Available services.
 */
export enum PhoneServices {
  VERIFICATION = 'VERIFICATION',
}

/**
 * Phone adapter.
 *
 * @see Twilio
 */
@Service()
export default class PhoneAdapter {
  /**
   * Phone client.
   */
  private readonly twilio: Twilio;

  /**
   * Services API keys.
   */
  private readonly services: Record<keyof typeof PhoneServices, string>;

  /**
   *Construct a new phone adapter.

   * @param username - The username used for authentication. This is normally account sid, but if using key/secret auth will be the api key sid.
   * @param password - The password used for authentication. This is normally auth token, but if using key/secret auth will be the secret.
   * @param services - Services API keys
   */
  public constructor(
    username: string,
    password: string,
    services: Record<keyof typeof PhoneServices, string>,
  ) {
    this.twilio = new Twilio(username, password, {
      lazyLoading: true,
    });
    this.services = services;
  }

  /**
   * Send a verification code to the phone number.
   *
   * @param phone - Phone number
   * @returns Verification instance data
   */
  public sendVerification(phone: string): Promise<VerificationInstance> {
    // TODO Phone verification can be used only in production environment
    if (!EnvUtil.isProduction())
      return Promise.resolve((undefined as unknown) as VerificationInstance);

    return this.twilio.verify
      .services(this.services.VERIFICATION)
      .verifications.create({ to: phone, channel: 'sms' });
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
    if (!EnvUtil.isProduction())
      return Promise.resolve((undefined as unknown) as VerificationCheckInstance);

    return this.twilio.verify
      .services(this.services.VERIFICATION)
      .verificationChecks.create({ to: phone, code });
  }
}

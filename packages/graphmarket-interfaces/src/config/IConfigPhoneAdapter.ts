/**
 * Phone adapter configuration.
 */
export default interface IConfigPhoneAdapter {
  readonly USERNAME: string;
  readonly PASSWORD: string;
  readonly SERVICES: {
    readonly VERIFICATION: string;
  };
}

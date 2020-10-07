import bcrypt from 'bcryptjs';

export default class CryptUtil {
  private static readonly SALT_ROUNDS: number = 12;

  public static async hash(s: string): Promise<string> {
    return bcrypt.hash(s, await bcrypt.genSalt(CryptUtil.SALT_ROUNDS));
  }

  public static hashSync(s: string): string {
    return bcrypt.hashSync(s, bcrypt.genSaltSync(CryptUtil.SALT_ROUNDS));
  }

  public static async compare(s: string, hash: string): Promise<boolean> {
    return bcrypt.compare(s, hash);
  }

  public static compareSync(s: string, hash: string): boolean {
    return bcrypt.compareSync(s, hash);
  }
}

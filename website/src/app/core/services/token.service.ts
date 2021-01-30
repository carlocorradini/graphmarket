import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class TokenService {
  public static readonly TOKEN_KEY: string = 'AUTH_TOKEN';

  private readonly jwtHelper = new JwtHelperService();

  public getToken(): string | null {
    const token = window.localStorage.getItem(TokenService.TOKEN_KEY);

    if (!token) return null;
    if (this.jwtHelper.isTokenExpired(token)) {
      this.removeToken();
      return null;
    }

    return token;
  }

  public setToken(token: string): void {
    if (this.jwtHelper.isTokenExpired(token)) return;

    window.localStorage.setItem(TokenService.TOKEN_KEY, token);
  }

  public removeToken(): void {
    window.localStorage.removeItem(TokenService.TOKEN_KEY);
  }
}

import { Injectable } from '@angular/core';

const BEARER_TOKEN_LOCATION = 'desert-21-token';

@Injectable({
  providedIn: 'root',
})
export class BearerTokenService {

  saveToken(token: string): void {
    localStorage.setItem(BEARER_TOKEN_LOCATION, token);
  }

  clearToken(): void {
    localStorage.removeItem(BEARER_TOKEN_LOCATION);
  }

  getToken(): string {
    return localStorage.getItem(BEARER_TOKEN_LOCATION);
  }
}

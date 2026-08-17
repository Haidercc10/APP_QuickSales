import { Injectable } from '@angular/core';

export const TOKEN_KEY = 'qs_access_token';

@Injectable({
  providedIn: 'root'
})
export class SvCacheService {

  constructor() { }

  /** Guarda el token JWT en localStorage (persiste entre sesiones del navegador). */
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /** Devuelve el token guardado, o null si no existe. */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  }

  /** Verifica si hay un token activo en caché. */
  hasToken(): boolean {
    return this.getToken() !== null;
  }

  /** Elimina el token del caché (logout). */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
}
